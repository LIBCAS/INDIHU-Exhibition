import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { Spinner } from "components/loaders/spinner";
import { DialogType } from "components/dialogs/dialog-types";

// Types
import { AppDispatch } from "store/store";
import { SurveyScreen } from "models";

// Redux actions
import { saveScreen, updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";

// Api
import { deleteSurveyAnswersApi } from "containers/expo-administration/screen-survey/api";

// - - - - - - -

type SurveyLockButtonProps = {
  activeExpoId: string;
  activeScreen: SurveyScreen;
  rowNum: string | undefined;
  colNum: string | undefined;
};

const SurveyLockButton = ({
  activeExpoId,
  activeScreen,
  rowNum,
  colNum,
}: SurveyLockButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  // - - - States - - -

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lockingErrMsg, setLockingErrMsg] = useState<string>("");

  // - - - Derived variables - - -

  const isScreenLocked = useMemo<boolean>(
    () => activeScreen.isSurveyScreenLocked ?? false,
    [activeScreen.isSurveyScreenLocked]
  );

  const iconNameBefore = isScreenLocked ? "lock_reset" : "lock";

  const iconNameAfter = isScreenLocked ? "public" : "public_off";

  const btnText = isScreenLocked
    ? t("unlockSurveyBtnLabel")
    : t("lockSurveyBtnLabel");

  const btnTooltip = isScreenLocked
    ? t("unlockSurveyBtnTooltip")
    : t("lockSurveyBtnTooltip");

  // - - - Callbacks - - -

  /**
   *
   */
  const handleLock = useCallback(async () => {
    try {
      setLockingErrMsg("");
      setIsLoading(true);

      // Step 1
      await deleteSurveyAnswersApi(t, activeExpoId, activeScreen.id);

      // Step 2
      const activeScreenToSave = {
        ...activeScreen,
        isSurveyScreenLocked: true,
      };

      const result = await dispatch(
        saveScreen(activeScreenToSave, rowNum, colNum)
      );

      if (result !== true) {
        const errMsg = t("saveScreenErrMsg");
        throw Error(errMsg);
      }

      // Step 3
      dispatch(updateScreenData({ isSurveyScreenLocked: true }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const errMsg = `${t("lockSurveyErrMsgPrefix")}: ${msg}`;
      setLockingErrMsg(errMsg);
      console.error("[handleLockOnServer]: ", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeExpoId, activeScreen, rowNum, colNum, dispatch, t]);

  /**
   *
   */
  const handleUnlock = useCallback(async () => {
    try {
      setLockingErrMsg("");
      setIsLoading(true);

      // Step 1
      await deleteSurveyAnswersApi(t, activeExpoId, activeScreen.id);

      // Step 2
      const activeScreenToSave = {
        ...activeScreen,
        isSurveyScreenLocked: false,
      };

      const result = await dispatch(
        saveScreen(activeScreenToSave, rowNum, colNum)
      );

      if (result !== true) {
        const errMsg = t("saveScreenErrMsg");
        throw Error(errMsg);
      }

      // Step 3
      dispatch(updateScreenData({ isSurveyScreenLocked: false }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const errMsg = `${t("unlockSurveyErrMsgPrefix")}: ${msg}`;
      setLockingErrMsg(errMsg);
      console.error("[handleUnlockOnServer]: ", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeExpoId, activeScreen, rowNum, colNum, dispatch, t]);

  /**
   *
   */
  const handleLockDialog = useCallback(() => {
    dispatch(
      setDialog(DialogType.ConfirmDialog, {
        title: <div className="font-bold">{t("lockSurveyConfirmTitle")}</div>,
        text: t("lockSurveyConfirmText"),
        onSubmit: async () => await handleLock(),
        closeBefore: true,
      })
    );
  }, [t, dispatch, handleLock]);

  /**
   *
   */
  const handleUnlockDialog = useCallback(() => {
    dispatch(
      setDialog(DialogType.ConfirmDialog, {
        title: <div className="font-bold">{t("unlockSurveyConfirmTitle")}</div>,
        text: t("unlockSurveyConfirmText"),
        onSubmit: async () => await handleUnlock(),
        closeBefore: true,
      })
    );
  }, [t, dispatch, handleUnlock]);

  // - - - GUI - - -

  return (
    <div className="mt-6 flex-col justify-center items-center gap-2">
      <div className="w-full flex justify-center items-center">
        <Button
          color="secondary"
          type="outlined"
          big
          shadow
          iconBefore={<Icon name={iconNameBefore} />}
          iconAfter={<Icon name={iconNameAfter} />}
          disabled={isLoading}
          tooltip={{
            id: "lock-survey-screen-button",
            content: btnTooltip,
            variant: "dark",
            style: { maxWidth: 222 },
          }}
          onClick={isScreenLocked ? handleUnlockDialog : handleLockDialog}
        >
          {btnText}
        </Button>
      </div>

      {lockingErrMsg !== "" ? (
        <div className="mt-2 text-danger text-center">{lockingErrMsg}</div>
      ) : isLoading ? (
        <div className="mt-2">
          <Spinner className="w-8 h-8 border-x-secondary border-t-secondary" />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default SurveyLockButton;
