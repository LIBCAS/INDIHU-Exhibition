import { Document } from "models";
import { useTranslation } from "react-i18next";

import { DialogProps, DialogType } from "../dialog-types";
import Dialog from "../dialog-wrap";
import { FileItem } from "./file-item";

export type FilesDialogData = {
  files?: Document[];
};

export const FilesDialog = ({
  dialogData,
}: DialogProps<DialogType.FilesDialog>) => {
  const files = dialogData?.files ?? [];
  const { t } = useTranslation("exposition");

  return (
    <Dialog
      big
      title={
        <span className="text-2xl font-bold">{`${t("files")} (${
          files.length
        })`}</span>
      }
      name={DialogType.FilesDialog}
      noDialogMenu
    >
      {!files.length && t("no-files")}
      {files.map((file, index) => (
        <FileItem key={index} file={file} />
      ))}
    </Dialog>
  );
};
