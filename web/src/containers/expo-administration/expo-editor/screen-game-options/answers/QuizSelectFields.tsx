import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";

import SelectField from "react-md/lib/SelectFields";

import { GameQuizAnswersType, GameQuizScreen, GameQuizType } from "models";

import { updateScreenData } from "actions/expoActions/screen-actions-typed";
import { gameQuizAnswersType, gameQuizType } from "enums/screen-enums";

const gameQuizAnswersTypeOptions = [
  {
    label: "Práve jedna správna odpoveď",
    value: gameQuizAnswersType.SIMPLE_CHOICE,
  },
  {
    label: "Viacero správnych odpovedí",
    value: gameQuizAnswersType.MULTIPLE_CHOICE,
  },
];

const gameQuizTypeOptions = [
  {
    label: "Iba text",
    value: gameQuizType.ONLY_TEXT,
  },
  {
    label: "Iba obrázok",
    value: gameQuizType.ONLY_IMAGES,
  },
  {
    label: "Aj obrázok aj text",
    value: gameQuizType.TEXT_IMAGES,
  },
];

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
