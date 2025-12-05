import ReactDOM from "react-dom";
import { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// Components
import { Grid } from "@mui/material";

import SurveyAnswerItem from "./variant-answers/SurveyAnswerItem";
import SurveyFreeAnswerItem from "./variant-answers/SurveyFreeAnswerItem";

import { GameInfoPanel } from "../games/GameInfoPanel";
import { GameActionsPanel } from "../games/GameActionsPanel";

// Types
import { AppState } from "store/store";
import { ScreenProps, SurveyScreen, SurveyType } from "models";

// Utils
import { DEFAULT_SURVEY_TYPE } from "containers/expo-administration/screen-survey/default-values";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as SurveyScreen,
  (viewScreen) => ({ viewScreen })
);

export const ViewSurvey = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation("view-screen", { keyPrefix: "surveyScreen" });

  // - - - Data about Survey from administration - - -

  const surveyType = useMemo<SurveyType>(
    () => viewScreen.surveyType ?? DEFAULT_SURVEY_TYPE,
    [viewScreen.surveyType]
  );

  const shouldIncludeFreeAnswer = useMemo<boolean>(
    () => viewScreen.shouldIncludeFreeAnswer ?? false,
    [viewScreen.shouldIncludeFreeAnswer]
  );

  // - - - Game State - - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [markedAnswerIdx, setMarkedAnswerIdx] = useState<number | null>(null);

  const [isFreeAnswerMarked, setIsFreeAnswerMarked] = useState<boolean>(false);

  // - - - Callbacks - - -

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    setMarkedAnswerIdx(null);
  }, []);

  const handleMarkClassicAnswer = useCallback((asnwerIdx) => {
    setIsFreeAnswerMarked(false);
    setMarkedAnswerIdx(asnwerIdx);
  }, []);

  const handleMarkFreeAnswer = useCallback(() => {
    setMarkedAnswerIdx(null);
    setIsFreeAnswerMarked(true);
  }, []);

  // - - - GUI - - -

  return (
    <div className="w-full h-full px-[5%] xl:px-[10%] py-[5%]">
      <div className="h-full overflow-auto expo-scrollbar pr-4 pb-16 md:pb-32">
        <div className="min-h-full flex flex-col justify-center items-center gap-8 md:gap-12">
          {/* 1. Title */}
          <div className="w-full text-center text-white font-bold text-2xl md:text-3xl mt-4 md:mt-0">
            {viewScreen.task ?? t("missingTaskText")}
          </div>

          {/* 2. Answers */}
          <Grid container spacing={{ xs: 4, md: 4, lg: 6 }}>
            {viewScreen.surveyAnswers?.map((answer, answerIdx) => (
              <SurveyAnswerItem
                key={answerIdx}
                answer={answer}
                answerIdx={answerIdx}
                preloadedImgSrc={
                  screenPreloadedFiles?.surveyAnswers?.[answerIdx]?.image
                }
                isGameFinished={isGameFinished}
                surveyType={surveyType}
                shouldShowAnswerFeedback={
                  viewScreen.shouldShowAnswerFeedback ?? false
                }
                isAnswerMarked={markedAnswerIdx === answerIdx}
                handleMarkThisAnswer={handleMarkClassicAnswer}
              />
            ))}

            {shouldIncludeFreeAnswer && (
              <SurveyFreeAnswerItem
                isGameFinished={isGameFinished}
                isAnswerMarked={isFreeAnswerMarked}
                handleMarkThisAnswer={handleMarkFreeAnswer}
              />
            )}
          </Grid>
        </div>
      </div>

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            solutionText={t("solution")}
          />,
          infoPanelRef.current
        )}

      {actionsPanelRef.current &&
        ReactDOM.createPortal(
          <GameActionsPanel
            isMobileOverlay={isMobileOverlay}
            isGameFinished={isGameFinished}
            onGameFinish={onGameFinish}
            onGameReset={onGameReset}
          />,
          actionsPanelRef.current
        )}
    </div>
  );
};
