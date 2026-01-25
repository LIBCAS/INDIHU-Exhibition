import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Types
import { AppDispatch } from "store/store";
import { DialogType } from "components/dialogs/dialog-types";

// Utils
import { setDialog } from "actions/dialog-actions";
import { sleep } from "utils/sleep";

// Api
import { deleteSurveyAnswersApi } from "../api";

// - - - - - -

type Props = {
  activeExpoId: string; // NOTE: uuid
  activeScreenId: string; // NOTE: uuid
  handleClearSurveyAnswers?: () => void;
};

/**
 * Hook responsible for deleting survey answers for single particular screen on the server
 */
const useDeleteSurveyAnswers = ({
  activeExpoId,
  activeScreenId,
  handleClearSurveyAnswers,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  // - - - States - - -

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteErrMsg, setDeleteErrMsg] = useState<string>("");

  // - - - Callbacks - - -

  /**
   *
   */
  const handleDeleteAnswers = useCallback(async () => {
    try {
      setDeleteErrMsg("");
      setIsDeleting(true);

      const expoId = activeExpoId;
      const screenId = activeScreenId;

      await sleep(1000);
      await deleteSurveyAnswersApi(t, expoId, screenId);

      // NOTE: Additional action
      handleClearSurveyAnswers?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const errMsg = `${t("deleteSurveyAnswersErrMsg")}: ${msg}`;
      setDeleteErrMsg(errMsg);
      console.error("[handleDeleteAnswersOnServer]: ", err);
    } finally {
      setIsDeleting(false);
    }
  }, [activeExpoId, activeScreenId, handleClearSurveyAnswers, t]);

  /**
   *
   */
  const handleDeleteAnswersDialog = useCallback(async () => {
    dispatch(
      setDialog(DialogType.ConfirmDialog, {
        title: (
          <div className="font-bold">
            {t("deleteSurveyAnswersConfirmationTitle")}
          </div>
        ),
        text: t("deleteSurveyAnswersConfirmationText"),
        onSubmit: async () => await handleDeleteAnswers(),
        closeBefore: true,
      })
    );
  }, [t, dispatch, handleDeleteAnswers]);

  // - - - Return Value - - -

  return {
    isDeleting,
    deleteErrMsg,
    handleDeleteAnswers,
    handleDeleteAnswersDialog,
  };
};

export default useDeleteSurveyAnswers;
