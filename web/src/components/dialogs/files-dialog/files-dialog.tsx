import { useTranslation } from "react-i18next";

// Components
import Dialog from "../dialog-wrap-typed";
import { FileItem } from "./file-item";

// Models
import { Document } from "models";
import { DialogProps, DialogType } from "../dialog-types";
import { isWorksheetFile } from "containers/views/utils";

export type FilesDialogDataProps = {
  files?: Document[];
};

export const FilesDialog = ({
  dialogData,
}: DialogProps<DialogType.FilesDialog>) => {
  const { t } = useTranslation("exhibition");

  const allFiles = dialogData?.files ?? [];
  const expoFiles = allFiles.filter(
    (currFile: Document) => !isWorksheetFile(currFile)
  );

  return (
    <Dialog
      big
      title={
        <span className="text-2xl font-bold">{`${t("files")} (${
          expoFiles.length
        })`}</span>
      }
      name={DialogType.FilesDialog}
      noDialogMenu
    >
      {!expoFiles.length && t("no-files")}
      {expoFiles.map((file, index) => (
        <FileItem key={index} file={file} />
      ))}
    </Dialog>
  );
};
