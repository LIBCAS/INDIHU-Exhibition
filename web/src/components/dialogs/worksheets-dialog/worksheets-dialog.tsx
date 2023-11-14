import { useTranslation } from "react-i18next";

// Components
import DialogWrap from "../dialog-wrap-noredux-typed";
import { FileItem } from "../files-dialog/file-item"; // from FilesDialog

// Models
import { Document } from "models";

import { isWorksheetFile } from "utils/view-utils";

export type WorksheetsDialogProps = {
  closeThisDialog: () => void;
  files?: Document[];
};

export const WorksheetsDialog = ({
  closeThisDialog,
  files,
}: WorksheetsDialogProps) => {
  const { t } = useTranslation("view-exhibition");

  const allFiles = files ?? [];
  const worksheetFiles = allFiles.filter((currFile: Document) =>
    isWorksheetFile(currFile)
  );

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={
        <span className="text-2xl font-bold">{`${t("worksheets")} (${
          worksheetFiles.length
        })`}</span>
      }
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      {!worksheetFiles.length && t("no-worksheets")}
      {worksheetFiles.map((file, index) => (
        <FileItem key={index} file={file} />
      ))}
    </DialogWrap>
  );
};
