import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import TagsList from "components/tags-list/TagsList";

import { StartScreen, ViewExpo } from "models";

import DialogWrap from "../dialog-wrap-noredux-typed";

import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";
import { isWorksheetFile } from "utils/view-utils";

// - - - - - - - - -

export type ExpoInfoDialogProps = {
  closeThisDialog: () => void;
  viewExpo: ViewExpo;
  viewScreen: StartScreen;
};

export const ExpoInfoDialog = ({
  closeThisDialog,
  viewExpo,
  viewScreen,
}: ExpoInfoDialogProps) => {
  const { t } = useTranslation("view-exhibition");

  const { openNewTopDialog } = useDialogRef();

  const expoPerexLines = useMemo(
    () =>
      viewScreen?.perex
        ? (viewScreen?.perex?.split("\n") as string[])
        : [t("no-perex")],
    [t, viewScreen?.perex]
  );

  const startExpoFiles = useMemo(
    () => viewScreen.documents?.filter((currDoc) => !isWorksheetFile(currDoc)),
    [viewScreen.documents]
  );

  const startWorksheetFiles = useMemo(
    () => viewScreen.documents?.filter((currDoc) => isWorksheetFile(currDoc)),
    [viewScreen.documents]
  );

  const openAuthorsDialog = useCallback(() => {
    openNewTopDialog(DialogRefType.ExpoAuthorsDialog);
  }, [openNewTopDialog]);

  const openChaptersDialog = useCallback(() => {
    openNewTopDialog(DialogRefType.ChaptersDialog);
  }, [openNewTopDialog]);

  const openFilesDialog = useCallback(() => {
    openNewTopDialog(DialogRefType.FilesDialog);
  }, [openNewTopDialog]);

  const openWorksheetDialog = useCallback(() => {
    openNewTopDialog(DialogRefType.WorksheetDialog);
  }, [openNewTopDialog]);

  const tags = useMemo(() => viewExpo?.tags, [viewExpo?.tags]);

  return (
    <>
      <DialogWrap
        closeThisDialog={closeThisDialog}
        title={<span className="text-2xl font-bold">{t("info")}</span>}
        big
        noDialogMenu
        closeOnEsc
        applyTheming
      >
        <div className="pb-3 border-b border-b-black border-opacity-10">
          {expoPerexLines}
        </div>

        {/* Dialog opening buttons */}
        <div className="flex justify-end items-center gap-2 my-2">
          <Button color="primary" onClick={openAuthorsDialog}>
            <Icon color="white" name="account_box" />
          </Button>
          <Button color="primary" onClick={openChaptersDialog}>
            <Icon color="white" name="layers" />
          </Button>
          {startWorksheetFiles?.length !== 0 && (
            <Button color="primary" onClick={openWorksheetDialog}>
              <Icon color="white" name="description" />
            </Button>
          )}
          {startExpoFiles?.length !== 0 && (
            <Button color="primary" onClick={openFilesDialog}>
              <Icon color="white" name="folder" />
            </Button>
          )}
        </div>

        {tags && (
          <div className="mt-4 flex justify-between items-center gap-6">
            <TagsList tags={tags} />
          </div>
        )}
      </DialogWrap>
    </>
  );
};
