import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { DialogType } from "components/dialogs/dialog-types";

// Types
import { AppDispatch } from "store/store";

// Redux actions
import { updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";

// - - - - - -

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// - - - - - - -

type SurveyLockButtonProps = {
  isScreenLocked: boolean;
};

const SurveyLockButton = ({ isScreenLocked }: SurveyLockButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  // - - - States - - -

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // - - - Derived variables - - -

  const iconNameBefore = isScreenLocked ? "lock_reset" : "lock";

  const iconNameAfter = isScreenLocked ? "public_off" : "public";

  const btnText = isScreenLocked
    ? t("lockSurveyBtnLabel")
    : t("unlockSurveyBtnLabel");

  const btnTooltip = isScreenLocked
    ? t("lockSurveyBtnTooltip")
    : t("unlockSurveyBtnTooltip");

  // - - - Callbacks - - -

  /**
   *
   */
  const handleLockOnServer = useCallback(async () => {
    try {
      setIsLoading(true);
      // TODO - first try to delete current testing asnwers and start clean
      await sleep(2000);
      dispatch(updateScreenData({ isSurveyScreenLocked: true }));
    } catch (err) {
      console.error("[handleLockOnServer]: ", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  /**
   *
   */
  const handleUnlockOnServer = useCallback(async () => {
    try {
      setIsLoading(true);
      // TODO - first try to delete current prod answers, because of data integrity
      await sleep(2000);
      dispatch(updateScreenData({ isSurveyScreenLocked: false }));
    } catch (err) {
      console.error("[handleUnlockOnServer]: ", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  /**
   *
   */
  const handleLockAndPublish = useCallback(() => {
    console.log("*** handleLockAndPublish ***");

    dispatch(
      setDialog(DialogType.ConfirmDialog, {
        title: <div className="font-bold">{t("lockSurveyConfirmTitle")}</div>,
        text: t("lockSurveyConfirmText"),
        onSubmit: async () => await handleLockOnServer(),
      })
    );
  }, [t, dispatch, handleLockOnServer]);

  /**
   *
   */
  const handleUnlockAndUnpublish = useCallback(() => {
    console.log("*** handleUnlockAndUnpublish ***");

    dispatch(
      setDialog(DialogType.ConfirmDialog, {
        title: <div className="font-bold">{t("unlockSurveyConfirmTitle")}</div>,
        text: t("unlockSurveyConfirmText"),
        onSubmit: async () => await handleUnlockOnServer(),
      })
    );
  }, [t, dispatch, handleUnlockOnServer]);

  // - - - GUI - - -

  return (
    <div className="mt-6 w-full flex justify-center items-center">
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
        onClick={
          isScreenLocked ? handleUnlockAndUnpublish : handleLockAndPublish
        }
      >
        {btnText}
      </Button>
    </div>
  );
};

export default SurveyLockButton;
