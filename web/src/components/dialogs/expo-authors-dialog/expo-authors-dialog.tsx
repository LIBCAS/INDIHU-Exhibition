import { useTranslation } from "react-i18next";

import DialogWrap from "../dialog-wrap-noredux-typed";
import { LabeledItem } from "components/labeled-item/labeled-item";

import { StartScreen } from "models";

// - - - -

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
      <div className="flex flex-col justify-start items-start gap-1">
        {collaboratorsData.map((collab, collabIndex) => (
          <LabeledItem key={collabIndex} label={collab.role}>
            {collab.text}
          </LabeledItem>
        ))}
      </div>
    </DialogWrap>
  );
};

export default ExpoAuthorsDialog;
