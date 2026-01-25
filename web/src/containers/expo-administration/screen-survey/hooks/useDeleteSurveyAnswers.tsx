import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Types
import { AppDispatch } from "store/store";
import { DialogType } from "components/dialogs/dialog-types";

// Utils
import { fetcher } from "utils/fetcher";
import { setDialog } from "actions/dialog-actions";

// - - - - - -

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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
  const handleDeleteAnswersOnServer = useCallback(
    async (rethrowError = false) => {
      try {
        setDeleteErrMsg("");
        setIsDeleting(true);

        const expoId = activeExpoId;
        const screenId = activeScreenId;

        await sleep(1000);
        const resp = await fetcher(`/api/survey/${expoId}/${screenId}`, {
          method: "DELETE",
        });

        const respStatus = resp.status;
        if (respStatus !== 200) {
          throw Error(`Kód chyby: ${respStatus}`);
        }

        // NOTE:
        handleClearSurveyAnswers?.();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const errMsg = `Behom vymazávania odpovedí došlo k nasledujúcej chybe: ${msg}`;
        setDeleteErrMsg(errMsg);
        console.error("[handleDeleteAnswersOnServer]: ", err);

        if (rethrowError) {
          throw Error(errMsg);
        }
      } finally {
        setIsDeleting(false);
      }
    },
    [activeExpoId, activeScreenId, handleClearSurveyAnswers]
  );

  /**
   *
   */
  const handleDeleteAnswers = useCallback(
    async (rethrowError = false) => {
      dispatch(
        setDialog(DialogType.ConfirmDialog, {
          title: <div className="font-bold">Vymazanie všetkých odpovedí</div>,
          text: "Ste si opravdu istý, že chcete vymazať všetky aktuálne zozbierané výsledky pre túto obrazovku ankety?",
          onSubmit: async () => await handleDeleteAnswersOnServer(rethrowError),
          closeBefore: true,
        })
      );
    },
    [dispatch, handleDeleteAnswersOnServer]
  );

  // - - - Return Value - - -

  return {
    isDeleting,
    deleteErrMsg,
    handleDeleteAnswers,
    handleDeleteAnswersOnServer,
  };
};

export default useDeleteSurveyAnswers;
