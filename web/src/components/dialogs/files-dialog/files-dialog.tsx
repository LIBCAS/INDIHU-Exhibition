import { useTranslation } from "react-i18next";

// Components
import DialogWrap from "../dialog-wrap-noredux-typed";

import { FileItem } from "./file-item";

// Models
import { Document } from "models";
import { isWorksheetFile } from "utils/view-utils";

export type FilesDialogProps = {
  closeThisDialog: () => void;
  files?: Document[];
};

export const FilesDialog = ({ closeThisDialog, files }: FilesDialogProps) => {
  const { t } = useTranslation("view-exhibition");

  const allFiles = files ?? [];
  const expoFiles = allFiles.filter(
    (currFile: Document) => !isWorksheetFile(currFile)
  );

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={
        <span className="text-2xl font-bold">{`${t("files")} (${
          expoFiles.length
        })`}</span>
      }
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      {!expoFiles.length && t("no-files")}
      {expoFiles.map((file, index) => (
        <FileItem key={index} file={file} />
      ))}
    </DialogWrap>
  );
};
