import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import TagsList from "components/tags-list/TagsList";
import { AppDispatch } from "store/store";
import { setDialog } from "actions/dialog-actions";

import { ViewExpo } from "models";

import { DialogProps, DialogType } from "../dialog-types";
//import Dialog from "../dialog-wrap";
import Dialog from "../dialog-wrap-typed";
import { useTranslation } from "react-i18next";

// - - - - - - - - -

export type ExpoInfoDialogDataProps = {
  viewExpo: ViewExpo;
  viewScreen: any;
};

export const ExpoInfoDialog = ({
  dialogData,
  closeDialog,
}: DialogProps<DialogType.ExpoInfoDialog>) => {
  const { viewExpo, viewScreen } = dialogData ?? {};
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibition");

  const expoPerexLines = useMemo(
    () =>
      viewScreen?.perex
        ? (viewScreen?.perex?.split("\n") as string[])
        : ["Expozice neobsahuje perex"],
    [viewScreen?.perex]
  );

  const openChaptersDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.ChaptersDialog, {
          screens: viewExpo?.structure?.screens,
          viewExpoUrl: viewExpo?.url,
          onClick: closeDialog,
        })
      ),
    [closeDialog, dispatch, viewExpo?.structure?.screens, viewExpo?.url]
  );

  const openFilesDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.FilesDialog, {
          files: viewScreen?.documents,
        })
      ),
    [dispatch, viewScreen?.documents]
  );

  const openWorkingListDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.WorksheetsDialog, { files: viewScreen?.documents })
      ),
    [dispatch, viewScreen?.documents]
  );

  const tags = useMemo(() => viewExpo?.tags, [viewExpo?.tags]);

  return (
    <Dialog
      big
      title={<span className="text-2xl font-bold">{t("info")}</span>}
      name={DialogType.ExpoInfoDialog}
      noDialogMenu
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
          <Button color="primary" onClick={openWorkingListDialog}>
            <Icon color="white" name="description" />
          </Button>
          <Button color="primary" onClick={openFilesDialog}>
            <Icon color="white" name="folder" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
