import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";
import { useTranslation } from "react-i18next";

import SelectField from "react-md/lib/SelectFields";

import {
  GameQuizAnswerDisplayType,
  GameQuizAnswersType,
  GameQuizScreen,
  GameQuizType,
} from "models";

import { updateScreenData } from "actions/expoActions/screen-actions";
import {
  GameQuizAnswerEnum,
  GameQuizEnum,
  GameQuizTextDisplayEnum,
} from "enums/administration-screens";

// - -

type GameQuizAnswersTypeSelectProps = {
  activeScreen: GameQuizScreen;
};

export const GameQuizAnswersTypeSelect = ({
  activeScreen,
}: GameQuizAnswersTypeSelectProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameQuizScreen",
  });

  return (
    <div className="w-full xl:w-fit">
      <SelectField
        menuItems={[
          {
            label: t("asnwerTypeSingleChoiceOption"),
            value: GameQuizAnswerEnum.SIMPLE_CHOICE,
          },
          {
            label: t("answerTypeMultipleChoiceOption"),
            value: GameQuizAnswerEnum.MULTIPLE_CHOICE,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={t("asnwerTypeLabel")}
        position="below"
        id="answers-type"
        name="answers-type"
        defaultValue={activeScreen.answersType ?? "SIMPLE_CHOICE"}
        onChange={(newValue: GameQuizAnswersType) => {
          dispatch(updateScreenData({ answersType: newValue }));
          if (newValue === "SIMPLE_CHOICE") {
            dispatch(
              updateScreenData({
                answers: activeScreen.answers.map((ans) => ({
                  ...ans,
                  correct: false,
                })),
              })
            );
          }
        }}
        fullWidth
      />
    </div>
  );
};

// - - -

type GameQuizTypeSelectProps = { activeScreen: GameQuizScreen };

export const GameQuizTypeSelect = ({
  activeScreen,
}: GameQuizTypeSelectProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameQuizScreen",
  });

  return (
    <div className="w-full xl:w-fit">
      <SelectField
        menuItems={[
          {
            label: t("quizTypeOnlyTextOption"),
            value: GameQuizEnum.ONLY_TEXT,
          },
          {
            label: t("quizTypeOnlyImageOption"),
            value: GameQuizEnum.ONLY_IMAGES,
          },
          {
            label: t("quizTypeBothTextImageOption"),
            value: GameQuizEnum.TEXT_IMAGES,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={t("quizTypeLabel")}
        position="below"
        id="quiz-type"
        name="quiz-type"
        defaultValue={activeScreen.quizType ?? "TEXT_IMAGES"}
        onChange={(newValue: GameQuizType) => {
          dispatch(updateScreenData({ quizType: newValue }));
        }}
        fullWidth
      />
    </div>
  );
};

// - - -

type GameQuizAnswerTextDisplaySelectProps = { activeScreen: GameQuizScreen };

export const GameQuizAnswerTextDisplaySelect = ({
  activeScreen,
}: GameQuizAnswerTextDisplaySelectProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameQuizScreen",
  });

  return (
    <div className="w-full xl:w-fit">
      <SelectField
        menuItems={[
          {
            label: t("asnwerDisplayTypeImmediateOption"),
            value: GameQuizTextDisplayEnum.QUIZ_TEXT_IMMEDIATELY,
          },
          {
            label: t("answerDisplayTypeAfterEvaluationOption"),
            value: GameQuizTextDisplayEnum.QUIZ_TEXT_AFTER_EVALUATION,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={t("answerDisplayTypeLabel")}
        position="below"
        id="quiz-answer-text-display"
        defaultValue={
          activeScreen.answersTextDisplayType ?? "QUIZ_TEXT_IMMEDIATELY"
        }
        onChange={(newValue: GameQuizAnswerDisplayType) => {
          dispatch(updateScreenData({ answersTextDisplayType: newValue }));
        }}
      />
    </div>
  );
};
