import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSpring, animated } from "react-spring";

// Hooks
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import DialogWrap from "../dialog-wrap-noredux-typed";
import { FileItem } from "../files-dialog/file-item";
import { Collapse } from "components/collapse/collapse";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { Document, File, ScreenWithOnlyTypeTitleDocuments } from "models";

// Utils
import { isWorksheetFile } from "utils/view-utils";
import cx from "classnames";

// - - - - - -

export type FinishAllFilesDialogProps = {
  closeThisDialog: () => void;
  startFiles: Document[]; // NOTE: This comes from `viewExpo.structure.start.documents`
  screensFiles: ScreenWithOnlyTypeTitleDocuments[][]; // NOTE: This comes from `viewExpo.structure.screens`
  expoAudioVersionFile: File | null; // NOTE: This comes from `viewExpo.structure.start.audio`
};

export const FinishAllFilesDialog = ({
  closeThisDialog,
  startFiles,
  screensFiles,
  expoAudioVersionFile,
}: FinishAllFilesDialogProps) => {
  const { t } = useTranslation("view-exhibition");
  const { isLightMode } = useExpoDesignData();

  // - - - Derived variables - - -

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

  // - - - GUI - - -

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">{t("all-files")}</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <div className="flex flex-col gap-6">
        {/* Expo Worksheets */}
        <div>
          <h1
            className={cx("text-xl underline", {
              "text-gray": isLightMode,
              "text-dark-mode-f": !isLightMode,
            })}
          >
            {t("worksheets")}
          </h1>
          {(!worksheetFiles || worksheetFiles.length === 0) && (
            <span>{t("no-worksheets")}</span>
          )}
          {worksheetFiles?.map((worksheetFile: Document, index: number) => (
            <FileItem key={index} file={worksheetFile} isFromFinishFileDialog />
          ))}
        </div>

        {/* Expo Standard Files */}
        <div>
          <h1
            className={cx("text-xl underline", {
              "text-gray": isLightMode,
              "text-dark-mode-f": !isLightMode,
            })}
          >
            {t("files")}
          </h1>
          {(!expoFiles || expoFiles.length === 0) && (
            <span>{t("no-files")}</span>
          )}
          {expoFiles?.map((expoFile: Document, index: number) => (
            <FileItem key={index} file={expoFile} isFromFinishFileDialog />
          ))}
        </div>

        {/* Expo Audio Version */}
        {expoAudioVersionFile && (
          <div>
            <h1
              className={cx("text-xl underline", {
                "text-gray": isLightMode,
                "text-dark-mode-f": !isLightMode,
              })}
            >
              {t("expo-audio-version")}
            </h1>
            <FileItem
              file={{
                ...expoAudioVersionFile,
                fileName: expoAudioVersionFile.name,
              }}
              isFromFinishFileDialog
            />
          </div>
        )}

        {/* Files of particular screens */}
        <div>
          <h1
            className={cx("text-xl underline", {
              "text-gray": isLightMode,
              "text-dark-mode-f": !isLightMode,
            })}
          >
            {t("screen-files")}
          </h1>
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
    </DialogWrap>
  );
};

// - - - - - -

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
        <Collapse isOpen={areDocumentsOpened} className="overflow-hidden">
          {screenInfo.documents.map((doc: Document, index: number) => (
            <FileItem key={index} file={doc} isFromFinishFileDialog isSubItem />
          ))}
        </Collapse>
      )}
    </div>
  );
};
