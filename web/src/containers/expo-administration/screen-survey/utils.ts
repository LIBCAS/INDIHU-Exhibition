import {
  SurveyAggregatedResp,
  SurveyAnswerItem,
  SurveyChoiceAnswer,
  SurveyChoiseAnswerItem,
  SurveyFreeAnswerItem,
  SurveyAnswer,
} from "./typings";
import { SurveyAnswerEditor } from "models";

// - - - - - -

export const answerIdxToTypeTranslator = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
] as const;

// - - - - - -

export const answerTypeToIdxTranslator = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

// - - - - - - -

type CurrentAnswerCountResult = {
  currentAnswerCount: number;
  totalAnswersCount: number;
};

const choiceCountMap = {
  a: (r: SurveyAggregatedResp) => r.countA,
  b: (r: SurveyAggregatedResp) => r.countB,
  c: (r: SurveyAggregatedResp) => r.countC,
  d: (r: SurveyAggregatedResp) => r.countD,
  e: (r: SurveyAggregatedResp) => r.countE,
  f: (r: SurveyAggregatedResp) => r.countF,
  g: (r: SurveyAggregatedResp) => r.countG,
  h: (r: SurveyAggregatedResp) => r.countH,
};

export const calculateCurrentAnswerCount = (
  answerToPost: SurveyAnswer,
  aggregatedResp: SurveyAggregatedResp
): CurrentAnswerCountResult => {
  // FREE answer case
  if (answerToPost.answerType === "FREE") {
    return {
      currentAnswerCount: aggregatedResp.freeAnswers,
      totalAnswersCount: aggregatedResp.totalAnswers,
    };
  }

  // CHOICE answer case (a → h)
  const getCount = choiceCountMap[answerToPost.answer];

  return {
    currentAnswerCount: getCount(aggregatedResp),
    totalAnswersCount: aggregatedResp.totalAnswers,
  };
};

// - - - - - - -

/**
 *
 * @param answerItems coming from BE server
 * @param surveyAnswers coming from activeScreen and thus from screen administration
 */
export const processSurveyAnswersFromServer = (
  answerItems: SurveyAnswerItem[] | undefined,
  surveyAnswers: SurveyAnswerEditor[] | undefined
) => {
  // 1)
  if (answerItems === undefined) {
    return undefined;
  }
  if (surveyAnswers === undefined) {
    return undefined;
  }

  // 2)
  const choiceAnswers: SurveyChoiseAnswerItem[] = [];
  const freeAnswers: SurveyFreeAnswerItem[] = [];

  for (const item of answerItems) {
    if (item.answerType === "CHOICE") {
      choiceAnswers.push(item);
    } else if (item.answerType === "FREE") {
      freeAnswers.push(item);
    } else {
      // pass
    }
  }

  const numberOfAllAnswers = answerItems.length;
  const numberOfFreeAnswers = freeAnswers.length;
  const numberOfChoiseAnswers = choiceAnswers.length;

  // 3)
  const choiceCounts: Record<SurveyChoiceAnswer["answer"], number> = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
  };

  for (const item of choiceAnswers) {
    choiceCounts[item.answer] += 1;
  }

  // 4)
  type SingleChoiceAnswerData = {
    answerCount: number;
    answerLabel: string;
    answerText: string;
    answerPercentage: string;
  };

  type ChoiceAnswersData = Partial<
    Record<SurveyChoiceAnswer["answer"], SingleChoiceAnswerData>
  >;

  const choiceData: ChoiceAnswersData = {};

  for (const item of Object.entries(choiceCounts)) {
    const [answerType, answerCount] = item;
    const answerTypeTyped = answerType as SurveyChoiceAnswer["answer"];

    const idx = answerTypeToIdxTranslator[answerTypeTyped];
    const surveyAnswerAdministration = surveyAnswers?.[idx];

    // NOTE: This can easily happen - when not all 8 answer items are used in administration
    if (surveyAnswerAdministration === undefined) {
      continue;
    }

    const customUserLabel = surveyAnswerAdministration?.customUserLabel;
    const text = surveyAnswerAdministration?.text;

    const answerRatio =
      numberOfChoiseAnswers === 0 ? 0 : answerCount / numberOfChoiseAnswers;
    const answerPercentage = isNaN(answerRatio)
      ? "-"
      : `${(answerRatio * 100).toFixed(2)}%`;

    const newObj: SingleChoiceAnswerData = {
      answerCount: answerCount,
      answerLabel: customUserLabel ?? answerTypeTyped,
      answerText: text ?? "N/A",
      answerPercentage: answerPercentage,
    };

    choiceData[answerTypeTyped] = newObj;
  }

  // 5)
  return {
    answerItems,
    choiceAnswers,
    freeAnswers,

    numberOfAllAnswers,
    numberOfChoiseAnswers,
    numberOfFreeAnswers,

    choiceData,
  };
};
