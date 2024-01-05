import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import TagsList from "components/tags-list/TagsList";

import { ViewExpo } from "models";

import DialogWrap from "../dialog-wrap-noredux-typed";

import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";

// - - - - - - - - -

export type ExpoInfoDialogProps = {
  closeThisDialog: () => void;
  viewExpo: ViewExpo;
  viewScreen: any;
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
        <div className="pb-5 border-b border-b-black border-opacity-10">
          {expoPerexLines}
        </div>
        <div className="mt-5 flex justify-between items-center gap-6">
          {/* Tags */}
          {tags && <TagsList tags={tags} />}

          {/* Dialog opening buttons */}
          <div className="flex items-center gap-2">
            <Button color="primary" onClick={openChaptersDialog}>
              <Icon color="white" name="layers" />
            </Button>
            <Button color="primary" onClick={openWorksheetDialog}>
              <Icon color="white" name="description" />
            </Button>
            <Button color="primary" onClick={openFilesDialog}>
              <Icon color="white" name="folder" />
            </Button>
          </div>
        </div>
      </DialogWrap>
    </>
  );
};
