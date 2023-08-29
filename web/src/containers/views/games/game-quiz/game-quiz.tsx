import ReactDOM from "react-dom";
import { useCallback, useState, useMemo, useEffect } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

import { GameToolbar } from "../game-toolbar";
import ImageTextAnswer from "./ImageTextAnswer";

import { AppState } from "store/store";
import { ScreenProps, GameQuizScreen } from "models";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameQuizScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameQuiz = ({ screenPreloadedFiles, toolbarRef }: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation("screen");

  const {
    infopointOpenStatusMap,
    setInfopointOpenStatusMap,
    closeInfopoints: closeAllInfopoints,
  } = useTooltipInfopoint(viewScreen);

  const isMultipleChoice = useMemo(
    () => viewScreen.answersType === "MULTIPLE_CHOICE",
    [viewScreen.answersType]
  );

  const quizType = viewScreen.quizType ?? "TEXT_IMAGES";

  const [isFinished, setIsFinished] = useState<boolean>(false); // true after done button clicked
  const [markedAnswers, setMarkedAnswers] = useState<boolean[]>(() => {
    const answersLength = viewScreen.answers.length; // should be max 8
    return Array(answersLength).fill(false);
  });

  const onFinish = useCallback(() => {
    setIsFinished(true);
  }, []);

  const onReset = useCallback(() => {
    setIsFinished(false);
    setMarkedAnswers((prevMarks) => prevMarks.map(() => false));
  }, []);

  // - -

  const onKeydownAction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllInfopoints(viewScreen)();
      }
    },
    [closeAllInfopoints, viewScreen]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeydownAction);
    return () => {
      window.removeEventListener("keydown", onKeydownAction);
    };
  }, [onKeydownAction]);

  // - -

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10 p-4 md:p-8 lg:p-16 xl:p-20">
      <span className="text-white font-bold text-3xl text-center mt-16">
        {viewScreen.task ?? "Neuvedeno"}
      </span>

      {/* Answers */}
      {/* mb-32 for convinience, pt-4 for icon badges (top right cornet) */}
      <div className="w-full flex flex-wrap justify-evenly items-center gap-8 overflow-auto expo-scrollbar pb-32 pt-4">
        {viewScreen.answers.map((answer, answerIndex) => {
          return (
            <ImageTextAnswer
              key={answerIndex}
              answer={answer}
              answerIndex={answerIndex}
              preloadedImgSrc={
                screenPreloadedFiles.answers?.[answerIndex]?.image ?? ""
              }
              isFinished={isFinished}
              isMultipleChoice={isMultipleChoice}
              markedAnswers={markedAnswers}
              quizType={quizType}
              setMarkedAnswers={setMarkedAnswers}
              infopointOpenStatusMap={infopointOpenStatusMap}
              setInfopointOpenStatusMap={setInfopointOpenStatusMap}
            />
          );
        })}
      </div>

      {toolbarRef.current &&
        ReactDOM.createPortal(
          <GameToolbar
            text={t("game-quiz.task")}
            onFinish={onFinish}
            onReset={onReset}
            finished={isFinished}
            screen={viewScreen}
          />,
          toolbarRef.current
        )}
    </div>
  );
};
