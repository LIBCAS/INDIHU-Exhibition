import { useTranslation } from "react-i18next";

// Components
import Dialog from "../dialog-wrap-typed";
import { FileItem } from "../files-dialog/file-item"; // from FilesDialog

// Models
import { Document } from "models";
import { DialogProps, DialogType } from "../dialog-types";

import { isWorksheetFile } from "utils/view-utils";

export type WorksheetsDialogDataProps = {
  files?: Document[];
};

export const WorksheetsDialog = ({
  dialogData,
}: DialogProps<DialogType.WorksheetsDialog>) => {
  const { t } = useTranslation("exhibition");

  const allFiles = dialogData?.files ?? [];
  const worksheetFiles = allFiles.filter((currFile: Document) =>
    isWorksheetFile(currFile)
  );

  return (
    <Dialog
      big
      title={
        <span className="text-2xl font-bold">{`${t("worksheets")} (${
          worksheetFiles.length
        })`}</span>
      }
      name={DialogType.WorksheetsDialog}
      noDialogMenu
    >
      {!worksheetFiles.length && t("no-worksheets")}
      {worksheetFiles.map((file, index) => (
        <FileItem key={index} file={file} />
      ))}
    </Dialog>
  );
};
