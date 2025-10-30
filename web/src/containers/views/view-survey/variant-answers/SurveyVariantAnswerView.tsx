import ReactDOM from "react-dom";
import { useState, useCallback, MutableRefObject } from "react";
import { useTranslation } from "react-i18next";

// Components
import { Grid } from "@mui/material";
import SurveyAnswerItem from "./SurveyAnswerItem";
import { GameInfoPanel } from "containers/views/games/GameInfoPanel";
import { GameActionsPanel } from "containers/views/games/GameActionsPanel";

// Types
import { SurveyScreen, SurveyType } from "models";
import { ScreenPreloadedFiles } from "context/file-preloader/file-preloader-provider";

// - - - - - -

type SurveyVariantAnswerView = {
  screenPreloadedFiles: ScreenPreloadedFiles;
  viewScreen: SurveyScreen;
  infoPanelRef: MutableRefObject<HTMLDivElement | null>;
  actionsPanelRef: MutableRefObject<HTMLDivElement | null>;
  isMobileOverlay: boolean;
  surveyType: Exclude<SurveyType, "FREE_ANSWER">;
};

const SurveyVariantAnswerView = ({
  screenPreloadedFiles,
  viewScreen,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
  surveyType,
}: SurveyVariantAnswerView) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "surveyScreen" });

  // - - - Game State - - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [markedAnswerIdx, setMarkedAnswerIdx] = useState<number | null>(null);

  // - - - Callbacks - - -

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    setMarkedAnswerIdx(null);
  }, []);

  const handleMarkThisAnswer = useCallback((answerIdx) => {
    setMarkedAnswerIdx(answerIdx);
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
                handleMarkThisAnswer={handleMarkThisAnswer}
              />
            ))}
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

export default SurveyVariantAnswerView;
