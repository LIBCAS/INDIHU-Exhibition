import ReactDOM from "react-dom";
import { useCallback, useState, useMemo, useEffect } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

import { useMediaDevice } from "context/media-device-provider/media-device-provider";

import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";
import ImageTextAnswer from "./ImageTextAnswer";

import { AppState } from "store/store";
import { ScreenProps, GameQuizScreen } from "models";

import {
  GameQuizAnswerEnum,
  GameQuizEnum,
  GameQuizTextDisplayEnum,
} from "enums/administration-screens";

import cx from "classnames";
import { useTutorial } from "context/tutorial-provider/use-tutorial";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameQuizScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameQuiz = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);

  const { isSm, isMobileLandscape } = useMediaDevice();

  const {
    infopointOpenStatusMap,
    setInfopointOpenStatusMap,
    closeInfopoints: closeAllInfopoints,
  } = useTooltipInfopoint(viewScreen);

  const isMultipleChoice = useMemo(
    () => viewScreen.answersType === GameQuizAnswerEnum.MULTIPLE_CHOICE,
    [viewScreen.answersType]
  );

  const quizType = viewScreen.quizType ?? GameQuizEnum.TEXT_IMAGES;

  const answersTextDisplayType =
    viewScreen.answersTextDisplayType ??
    GameQuizTextDisplayEnum.QUIZ_TEXT_IMMEDIATELY;

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

  const { bind, TutorialTooltip, escapeTutorial } = useTutorial(
    "gameOptions",
    !isMobileOverlay
  );

  const onKeydownAction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllInfopoints(viewScreen)();
        escapeTutorial();
      }
    },
    [closeAllInfopoints, escapeTutorial, viewScreen]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeydownAction);
    return () => document.removeEventListener("keydown", onKeydownAction);
  });

  // - -

  return (
    <div
      className={cx(
        "w-full h-full flex flex-col justify-center items-center p-4 md:p-8 lg:p-16 xl:p-20",
        {
          "gap-10": !isSm && !isMobileLandscape,
          "gap-5": isSm || isMobileLandscape,
        }
      )}
    >
      <span
        className={cx("text-white font-bold text-3xl text-center", {
          "mt-16": !isSm && !isMobileLandscape,
          "mt-4": isSm || isMobileLandscape,
        })}
      >
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
              answerImageOrigData={
                viewScreen.answers?.[answerIndex]?.imageOrigData
              }
              preloadedImgSrc={
                screenPreloadedFiles.answers?.[answerIndex]?.image ?? ""
              }
              isFinished={isFinished}
              isMultipleChoice={isMultipleChoice}
              markedAnswers={markedAnswers}
              quizType={quizType}
              answersTextDisplayType={answersTextDisplayType}
              setMarkedAnswers={setMarkedAnswers}
              infopointOpenStatusMap={infopointOpenStatusMap}
              setInfopointOpenStatusMap={setInfopointOpenStatusMap}
            />
          );
        })}
      </div>

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isFinished}
            bindTutorial={bind("options")}
          />,
          infoPanelRef.current
        )}

      {actionsPanelRef.current &&
        ReactDOM.createPortal(
          <GameActionsPanel
            isMobileOverlay={isMobileOverlay}
            isGameFinished={isFinished}
            onGameFinish={onFinish}
            onGameReset={onReset}
          />,
          actionsPanelRef.current
        )}

      {TutorialTooltip}
    </div>
  );
};
