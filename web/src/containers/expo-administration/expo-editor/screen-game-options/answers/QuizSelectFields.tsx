import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";

import SelectField from "react-md/lib/SelectFields";

import {
  GameQuizAnswerDisplayType,
  GameQuizAnswersType,
  GameQuizScreen,
  GameQuizType,
} from "models";

import { updateScreenData } from "actions/expoActions/screen-actions-typed";
import {
  GameQuizAnswerEnum,
  GameQuizEnum,
  GameQuizTextDisplayEnum,
} from "enums/administration-screens";

// - -

const gameQuizAnswersTypeOptions = [
  {
    label: "Práve jedna správna odpoveď",
    value: GameQuizAnswerEnum.SIMPLE_CHOICE,
  },
  {
    label: "Viacero správnych odpovedí",
    value: GameQuizAnswerEnum.MULTIPLE_CHOICE,
  },
];

const gameQuizTypeOptions = [
  {
    label: "Iba text",
    value: GameQuizEnum.ONLY_TEXT,
  },
  {
    label: "Iba obrázok",
    value: GameQuizEnum.ONLY_IMAGES,
  },
  {
    label: "Aj obrázok aj text",
    value: GameQuizEnum.TEXT_IMAGES,
  },
];

const gameQuizTextDisplay = [
  {
    label: "Zobraziť ihneď po načítaní",
    value: GameQuizTextDisplayEnum.QUIZ_TEXT_IMMEDIATELY,
  },
  {
    label: "Zobrazit až po vyhodnotení kvízu",
    value: GameQuizTextDisplayEnum.QUIZ_TEXT_AFTER_EVALUATION,
  },
];

// - -

type GameQuizAnswersTypeSelectProps = {
  activeScreen: GameQuizScreen;
};

export const GameQuizAnswersTypeSelect = ({
  activeScreen,
}: GameQuizAnswersTypeSelectProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="w-full xl:w-fit">
      <SelectField
        menuItems={gameQuizAnswersTypeOptions}
        itemLabel={"label"}
        itemValue={"value"}
        label="Vyberte typ odpovedi"
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

  return (
    <div className="w-full xl:w-fit">
      <SelectField
        menuItems={gameQuizTypeOptions}
        itemLabel={"label"}
        itemValue={"value"}
        label="Vyberte formu kvízu"
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

  return (
    <div className="w-full xl:w-fit">
      <SelectField
        menuItems={gameQuizTextDisplay}
        itemLabel={"label"}
        itemValue={"value"}
        label="Vyberte kdy se má zobrazit text odpovědi"
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
