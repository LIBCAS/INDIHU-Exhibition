type SurveyBaseAnswer = {
  expoId: string;
  screenId: string;
};

export type SurveyChoiceAnswer = SurveyBaseAnswer & {
  answerType: "CHOICE";
  answer: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
};

export type SurveyFreeAnswer = SurveyBaseAnswer & {
  answerType: "FREE";
  answer: string;
};

export type SurveyAnswer = SurveyChoiceAnswer | SurveyFreeAnswer;

// - - - - - -

type SurveyBaseAnswerItem = {
  id: string;
  created: string;
  updated: string;
};

export type SurveyChoiseAnswerItem = SurveyChoiceAnswer & SurveyBaseAnswerItem;

export type SurveyFreeAnswerItem = SurveyFreeAnswer & SurveyBaseAnswerItem;

export type SurveyAnswerItem = SurveyAnswer & SurveyBaseAnswerItem;

// - - - - - -

export type SurveyAggregatedResp = {
  choiceAnswers: number;
  countA: number;
  countB: number;
  countC: number;
  countD: number;
  countE: number;
  countF: number;
  countG: number;
  countH: number;
  freeAnswers: number;
  totalAnswers: number;
};

export type SurveyAggregatedFullResp = SurveyAggregatedResp & {
  freeTextAnswers: string[];
};
