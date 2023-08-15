import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useSpring, animated } from "react-spring";

// Components
import Dialog from "../dialog-wrap-typed";
import { FileItem } from "../files-dialog/file-item"; // from FilesDialog

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { Collapse } from "components/collapse/collapse";

// Models
import { Document, ScreenWithOnlyTypeTitleDocuments } from "models";
import { DialogProps, DialogType } from "../dialog-types";

import { isWorksheetFile } from "utils/view-utils";

// - - - - -

export type FinishAllFilesDialogDataProps = {
  startFiles: Document[]; // from viewExpo.structure.start.documents
  screensFiles: ScreenWithOnlyTypeTitleDocuments[][]; // from viewExpo.structure.screens
};

export const FinishAllFilesDialog = ({
  dialogData,
}: DialogProps<DialogType.FinishAllFilesDialog>) => {
  const { t } = useTranslation("exhibition");

  const { startFiles, screensFiles } = dialogData ?? {}; // if not loaded yet

  const expoFiles = startFiles?.filter(
    (file: Document) => !isWorksheetFile(file)
  );

  const worksheetFiles = startFiles?.filter((file: Document) =>
    isWorksheetFile(file)
  );

  const screenFilesFlattedFiltered = screensFiles
    ?.flat()
    .filter(
      (screenFile: ScreenWithOnlyTypeTitleDocuments) =>
        "documents" in screenFile &&
        screenFile.documents &&
        screenFile.documents.length > 0
    );

  return (
    <Dialog
      big
      title={<span className="text-2xl font-bold">{t("all-files")}</span>}
      name={DialogType.FinishAllFilesDialog}
      noDialogMenu
    >
      <div className="flex flex-col gap-6">
        {/* Worksheets */}
        <div>
          <h1 className="text-xl underline">{t("worksheets")}</h1>
          {(!worksheetFiles || worksheetFiles.length === 0) && (
            <span>{t("no-worksheets")}</span>
          )}
          {worksheetFiles?.map((worksheetFile: Document, index: number) => (
            <FileItem key={index} file={worksheetFile} isFromFinishFileDialog />
          ))}
        </div>

        {/* ExpoFiles */}
        <div>
          <h1 className="text-xl underline">{t("files")}</h1>
          {(!expoFiles || expoFiles.length === 0) && (
            <span>{t("no-files")}</span>
          )}
          {expoFiles?.map((expoFile: Document, index: number) => (
            <FileItem key={index} file={expoFile} isFromFinishFileDialog />
          ))}
        </div>

        {/* ScreensFiles */}
        <div>
          <h1 className="text-xl underline">{t("screen-files")}</h1>
          {(!screenFilesFlattedFiltered ||
            screenFilesFlattedFiltered.length === 0) && (
            <span>{t("no-screen-files")}</span>
          )}
          <div className="flex flex-col">
            {screenFilesFlattedFiltered?.map(
              (screenInfo: ScreenWithOnlyTypeTitleDocuments, index: number) => (
                <ScreenDocuments key={index} screenInfo={screenInfo} />
              )
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

// - - -

type ScreenDocumentsProps = {
  screenInfo: ScreenWithOnlyTypeTitleDocuments;
};

const ScreenDocuments = ({ screenInfo }: ScreenDocumentsProps) => {
  const [areDocumentsOpened, setAreDocumentsOpened] = useState<boolean>(false);
  const { rotate } = useSpring({
    rotate: areDocumentsOpened ? "90deg" : "0deg",
  });

  return (
    <div>
      <div className="flex items-center p-2">
        <Button onClick={() => setAreDocumentsOpened(!areDocumentsOpened)}>
          <animated.div style={{ rotate }}>
            <Icon name="chevron_right" />
          </animated.div>
        </Button>
        <span className="ml-2">{screenInfo.title}</span>
      </div>

      {screenInfo.documents && screenInfo.documents.length !== 0 && (
        <Collapse isOpen={areDocumentsOpened}>
          {screenInfo.documents.map((doc: Document, index: number) => (
            <FileItem key={index} file={doc} isFromFinishFileDialog isSubItem />
          ))}
        </Collapse>
      )}
    </div>
  );
};
