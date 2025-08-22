import { useTranslation } from "react-i18next";

import DialogWrap from "../dialog-wrap-noredux-typed";
import AuthorsTable from "containers/views/view-start/AuthorsTable";

import { StartScreen } from "models";

// - - - - - -

export type ExpoAuthorsDialogProps = {
  closeThisDialog: () => void;
  collaboratorsData: StartScreen["collaborators"];
};

export const ExpoAuthorsDialog = ({
  closeThisDialog,
  collaboratorsData,
}: ExpoAuthorsDialogProps) => {
  const { t } = useTranslation("view-exhibition");

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">{t("authors")}</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <div className="max-h-[600px] overflow-y-auto expo-scrollbar">
        <AuthorsTable collaborators={collaboratorsData} />
      </div>
    </DialogWrap>
  );
};

export default ExpoAuthorsDialog;
