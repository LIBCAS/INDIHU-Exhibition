import ReactDOM from "react-dom";
import { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// Components
import { Grid } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

import SurveyAnswerItem from "./variant-answers/SurveyAnswerItem";
import SurveyFreeAnswerItem from "./variant-answers/SurveyFreeAnswerItem";

import { GameInfoPanel } from "../games/GameInfoPanel";
import { GameActionsPanel } from "../games/GameActionsPanel";

// Types
import { AppDispatch, AppState } from "store/store";
import { ScreenProps, SurveyScreen, SurveyType, ViewExpo } from "models";
import { SurveyAnswer } from "containers/expo-administration/screen-survey/typings";

// Redux actions
import { setScreensInfo } from "actions/expoActions/viewer-actions";

// Utils
import { DEFAULT_SURVEY_TYPE } from "containers/expo-administration/screen-survey/default-values";
import { fetcher } from "utils/fetcher";
import { answerIdxToTypeTranslator } from "containers/expo-administration/screen-survey/utils";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo as ViewExpo,
  ({ expo }: AppState) => expo.viewScreen as SurveyScreen,
  ({ expo }: AppState) => expo.screensInfo.isSurveyFreeAsnwerMarked,
  (viewExpo, viewScreen, isSurveyFreeAsnwerMarked) => ({
    viewExpo,
    viewScreen,
    isSurveyFreeAsnwerMarked,
  })
);

export const ViewSurvey = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewExpo, viewScreen, isSurveyFreeAsnwerMarked } =
    useSelector(stateSelector);
  const { t } = useTranslation("view-screen", { keyPrefix: "surveyScreen" });
  const dispatch = useDispatch<AppDispatch>();

  // - - - Data about Survey from administration - - -

  const isSurveyScreenLocked = useMemo<boolean>(
    () => viewScreen.isSurveyScreenLocked ?? false,
    [viewScreen.isSurveyScreenLocked]
  );

  const surveyType = useMemo<SurveyType>(
    () => viewScreen.surveyType ?? DEFAULT_SURVEY_TYPE,
    [viewScreen.surveyType]
  );

  const shouldIncludeFreeAnswer = useMemo<boolean>(
    () => viewScreen.shouldIncludeFreeAnswer ?? false,
    [viewScreen.shouldIncludeFreeAnswer]
  );

  const shouldShowAnswerFeedback = useMemo<boolean>(
    () => viewScreen.shouldShowAnswerFeedback ?? false,
    [viewScreen.shouldShowAnswerFeedback]
  );

  // - - - States (game) - - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [markedAnswerIdx, setMarkedAnswerIdx] = useState<number | null>(null);
  const [freeAnswerText, setFreeAnswerText] = useState<string>("");

  // - - - States (post-answers) - - -

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPostingAnswer, setIsPostingAnswer] = useState<boolean>(false);
  const [postingAnswerErrMsg, setPostingAnswerErrMsg] = useState<string>("");
  const [wasAnswerPosted, setWasAnswerPosted] = useState<boolean>(false);

  // - - - Callbacks (post-answers) - - -

  const handlePostAnswer = useCallback(async () => {
    try {
      // 1.
      const expoId = viewExpo?.id;
      const screenId = viewScreen?.id;

      if (!expoId || !screenId) {
        throw Error("Chýbajúca identifikácia výstavy alebo obrazovky");
      }

      // 2.
      let body: SurveyAnswer | null = null;

      if (markedAnswerIdx !== null) {
        body = {
          expoId: expoId,
          screenId: screenId,
          answerType: "CHOICE",
          answer: answerIdxToTypeTranslator[markedAnswerIdx],
        };
      } else if (freeAnswerText !== "") {
        body = {
          expoId: expoId,
          screenId: screenId,
          answerType: "FREE",
          answer: freeAnswerText,
        };
      }

      if (body === null) {
        return;
      }

      // 3.
      setIsPostingAnswer(true);
      setPostingAnswerErrMsg("");
      setWasAnswerPosted(false);

      const resp = await fetcher(`/api/survey/answer`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
      });

      const respStatus = resp.status;
      if (respStatus !== 200) {
        throw Error(`Kód chyby: ${respStatus}`);
      }
      setWasAnswerPosted(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const errMsg = `Behom nahrávania vašej odpovedi došlo k nasledujúcej chybe: ${msg}`;
      setPostingAnswerErrMsg(errMsg);
      console.error(errMsg);
    } finally {
      setIsPostingAnswer(false);
    }
  }, [viewExpo?.id, viewScreen?.id, markedAnswerIdx, freeAnswerText]);

  // - - - Callbacks (game) - - -

  const onGameFinish = useCallback(async () => {
    setIsGameFinished(true);
    await handlePostAnswer();
  }, [handlePostAnswer]);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    setMarkedAnswerIdx(null);
    setFreeAnswerText("");
  }, []);

  // - - - Callbacks (answers) - - -

  const handleMarkClassicAnswer = useCallback(
    (asnwerIdx) => {
      setMarkedAnswerIdx(asnwerIdx);
      setFreeAnswerText("");
      dispatch(setScreensInfo({ isSurveyFreeAsnwerMarked: false }));
    },
    [dispatch]
  );

  const handleMarkFreeAnswer = useCallback(() => {
    setMarkedAnswerIdx(null);
    dispatch(setScreensInfo({ isSurveyFreeAsnwerMarked: true }));
  }, [dispatch]);

  const handleClearAnswer = useCallback(() => {
    setMarkedAnswerIdx(null);
    dispatch(setScreensInfo({ isSurveyFreeAsnwerMarked: false }));
  }, [dispatch]);

  // - - - GUI - - -

  if (!isSurveyScreenLocked) {
    return (
      <div className="w-full h-full px-[5%] xl:px-[10%] py-[5%]">
        <div className="h-full flex flex-col justify-center items-center">
          <div className="w-full text-center text-white font-bold text-2xl md:text-3xl mt-4 md:mt-0">
            {t("surveyScreenNotLockedMsg")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full px-[5%] xl:px-[10%] py-[5%]"
      onClick={handleClearAnswer}
    >
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
                isAnswerMarked={markedAnswerIdx === answerIdx}
                handleMarkThisAnswer={handleMarkClassicAnswer}
              />
            ))}

            {shouldIncludeFreeAnswer && (
              <SurveyFreeAnswerItem
                isGameFinished={isGameFinished}
                isAnswerMarked={isSurveyFreeAsnwerMarked}
                handleMarkThisAnswer={handleMarkFreeAnswer}
                freeAnswerText={freeAnswerText}
                setFreeAnswerText={setFreeAnswerText}
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

      {/* Successfull post answer */}
      <Snackbar
        open={wasAnswerPosted}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert severity="success" onClose={() => setWasAnswerPosted(false)}>
          Vaša odpoveď bola úspešne nahratá.
        </Alert>
      </Snackbar>

      {/* Error occured while posting answer */}
      <Snackbar
        open={postingAnswerErrMsg !== ""}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert severity="error" onClose={() => setPostingAnswerErrMsg("")}>
          {postingAnswerErrMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};
