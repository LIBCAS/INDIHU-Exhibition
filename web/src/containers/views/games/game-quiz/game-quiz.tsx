import ReactDOM from "react-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

// Hooks
import { useTranslation } from "react-i18next";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

// Components
import { Grid } from "@mui/material";
import ImageTextAnswer from "./ImageTextAnswer";
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

// Types
import { AppState } from "store/store";
import { ScreenProps, GameQuizScreen } from "models";

import {
  GameQuizAnswerEnum,
  GameQuizEnum,
  GameQuizTextDisplayEnum,
} from "enums/administration-screens";

// - - - - - -

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
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  // - - - Data about Quiz from administration - - -

  const isMultipleChoice = useMemo(
    () => viewScreen.answersType === GameQuizAnswerEnum.MULTIPLE_CHOICE,
    [viewScreen.answersType]
  );

  const quizType = viewScreen.quizType ?? GameQuizEnum.TEXT_IMAGES;

  const answersTextDisplayType =
    viewScreen.answersTextDisplayType ??
    GameQuizTextDisplayEnum.QUIZ_TEXT_IMMEDIATELY;

  // - - - Game State - - -

  // NOTE: set to true after done button has been clicked
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // NOTE: maximum length of this array should be max 8 (based on administration settings)
  const [markedAnswers, setMarkedAnswers] = useState<boolean[]>(() => {
    const answersLength = viewScreen.answers.length;
    return Array(answersLength).fill(false);
  });

  // - - - Callbacks - - -

  const onFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onReset = useCallback(() => {
    setIsGameFinished(false);
    setMarkedAnswers((prevMarks) => prevMarks.map(() => false));
  }, []);

  // - - - Infopoints feature - - -

  const {
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints: closeAllInfopoints,
  } = useTooltipInfopoint(viewScreen);

  const onKeydownAction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllInfopoints(viewScreen)();
      }
    },
    [closeAllInfopoints, viewScreen]
  );

  // - - - Tutorial feature - - -

  const { bind, TutorialTooltip } = useTutorial("gameOptions", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - Effects - - -

  useEffect(() => {
    document.addEventListener("keydown", onKeydownAction);
    return () => document.removeEventListener("keydown", onKeydownAction);
  });

  // - - - GUI - - -

  return (
    <div className="w-full h-full px-[5%] xl:px-[10%] py-[5%]">
      <div className="h-full overflow-auto expo-scrollbar pr-4 pb-16 md:pb-32">
        <div className="flex flex-col justify-center items-center gap-8">
          {/* 1. Title */}
          <div className="w-full text-center text-white font-bold text-2xl md:text-3xl mt-4 md:mt-0">
            {viewScreen.task || t("game-quiz.missingTaskText")}
          </div>

          {/* 2. Answers */}
          <Grid container spacing={{ xs: 4, md: 4, lg: 6 }}>
            {viewScreen.answers.map((answer, answerIndex) => {
              return (
                <ImageTextAnswer
                  key={answerIndex}
                  answer={answer}
                  answerIndex={answerIndex}
                  preloadedImgSrc={
                    screenPreloadedFiles.answers?.[answerIndex]?.image
                  }
                  isGameFinished={isGameFinished}
                  isMultipleChoice={isMultipleChoice}
                  quizType={quizType}
                  answersTextDisplayType={answersTextDisplayType}
                  isAnswerMarked={markedAnswers[answerIndex]}
                  setMarkedAnswers={setMarkedAnswers}
                  infopointStatusMap={infopointStatusMap}
                  setInfopointStatusMap={setInfopointStatusMap}
                />
              );
            })}
          </Grid>
        </div>
      </div>

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            bindTutorial={bind("options")}
            solutionText={t("game-quiz.solution")}
          />,
          infoPanelRef.current
        )}

      {actionsPanelRef.current &&
        ReactDOM.createPortal(
          <GameActionsPanel
            isMobileOverlay={isMobileOverlay}
            isGameFinished={isGameFinished}
            onGameFinish={onFinish}
            onGameReset={onReset}
          />,
          actionsPanelRef.current
        )}

      {TutorialTooltip}
    </div>
  );
};
