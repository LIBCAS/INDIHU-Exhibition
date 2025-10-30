import ReactDOM from "react-dom";
import { useState, useCallback, MutableRefObject, useMemo } from "react";
import { useTranslation } from "react-i18next";

// Hooks
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import SurveyFreeAnswerTextArea from "./SurveyFreeAnswerTextArea";
import { GameInfoPanel } from "containers/views/games/GameInfoPanel";
import { GameActionsPanel } from "containers/views/games/GameActionsPanel";
import { Button } from "components/button/button";

// Types
import { SurveyScreen } from "models";

// - - - - - -

export const SURVEY_FREE_ANSWER_MAX_LENGTH = 150;

// - - - - - -

type SurveyFreeAnswerView = {
  viewScreen: SurveyScreen;
  infoPanelRef: MutableRefObject<HTMLDivElement | null>;
  actionsPanelRef: MutableRefObject<HTMLDivElement | null>;
  isMobileOverlay: boolean;
};

const SurveyFreeAnswerView = ({
  viewScreen,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: SurveyFreeAnswerView) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "surveyScreen" });
  const { isLightMode, palette } = useExpoDesignData();

  // - - - States - - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [freeAnswerText, setFreeAnswerText] = useState<string>("");

  // - - - Derived variables - - -

  const isTextTooLong = useMemo(
    () => freeAnswerText.length > SURVEY_FREE_ANSWER_MAX_LENGTH,
    [freeAnswerText.length]
  );

  // - - - Callbacks - - -

  const handleSendFreeAnswer = useCallback(() => {
    if (freeAnswerText.length > SURVEY_FREE_ANSWER_MAX_LENGTH) {
      return;
    }

    console.log();
    console.log("*** handleSendFreeAnswer ***");
    console.log("value: ", freeAnswerText);

    setIsGameFinished(true);
  }, [freeAnswerText]);

  // - - - GUI - - -

  return (
    <div className="w-full h-full px-[5%] xl:px-[10%] py-[5%]">
      <div className="h-full flex flex-col justify-center items-center gap-8 md:gap-12">
        {/* 1. Title */}
        <div className="w-full text-center text-white font-bold text-2xl md:text-3xl mt-4 md:mt-0">
          {viewScreen.task ?? t("missingTaskText")}
        </div>

        {/* 2. Free answer block */}
        <div className="w-full md:w-3/4 lg:w-1/2">
          <SurveyFreeAnswerTextArea
            value={freeAnswerText}
            setValue={setFreeAnswerText}
            placeholder={t("freeAnswerPlaceholder")}
            fullWidth
            rows={3}
          />

          <div className="mt-1 mx-1 flex justify-between items-center gap-4">
            <div className="text-sm text-warning">
              {isTextTooLong ? t("freeAnswerTooLongMsg") : ""}
            </div>

            <div
              className="text-right text-base"
              style={{
                color: isLightMode
                  ? palette["light-gray"]
                  : palette["medium-gray"],
              }}
            >
              {freeAnswerText.length}/{SURVEY_FREE_ANSWER_MAX_LENGTH}
            </div>
          </div>

          <div className="mt-1 w-full flex justify-center items-center">
            <Button
              color="expoTheme"
              big
              onClick={handleSendFreeAnswer}
              disabled={isTextTooLong}
            >
              {t("sendFreeAnswerBtnLabel")}
            </Button>
          </div>
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
          <GameActionsPanel isMobileOverlay={isMobileOverlay} />,
          actionsPanelRef.current
        )}
    </div>
  );
};

export default SurveyFreeAnswerView;
