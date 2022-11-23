import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSelector } from "reselect";

import { Icon } from "components/icon/icon";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { setChapterMusic } from "actions/expoActions/viewer-actions";
import { AppDispatch, AppState } from "store/store";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

import { ViewFinishButton } from "./view-finish-button";
import { ScreenProps } from "../types";
import { ViewFinishInfo } from "./view-finish-info";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.viewChapterMusic,
  (viewExpo, viewChapterMusic) => ({ viewExpo, viewChapterMusic })
);

export const ViewFinish = ({
  screenFiles,
}: Omit<ScreenProps, "toolbarRef">) => {
  const { viewExpo, viewChapterMusic } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useHistory();
  const isSM = useMediaQuery(breakpoints.down("md"));
  const { t } = useTranslation("exposition");

  const { url } = viewExpo ?? {};
  const { image } = screenFiles;

  useEffect(() => {
    if (!viewChapterMusic) {
      return;
    }
    viewChapterMusic.pause();
    viewChapterMusic.currentTime = 0;
    dispatch(setChapterMusic(null));
  }, [dispatch, viewChapterMusic]);

  const viewStart = useMemo(
    () => viewExpo?.structure.start,
    [viewExpo?.structure.start]
  );

  const replay = useCallback(() => push(`/view/${url}/start`), [push, url]);

  const openFilesDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.FilesDialog, {
          files: viewStart?.documents,
        })
      ),
    [dispatch, viewStart?.documents]
  );

  const openShareDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.ShareExpoDialog, {
          url: `${window.location.origin}/view/${url}`,
        })
      ),
    [dispatch, url]
  );

  const openFinishInfoDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.FinishInfoDialog, {
          viewExpo,
          viewStart,
        })
      ),
    [dispatch, viewExpo, viewStart]
  );

  return (
    <>
      {isSM && image && (
        <img
          src={image}
          className="w-full h-full absolute object-contain"
          alt="background"
        />
      )}

      <div className="w-full h-full flex absolute">
        <div className="h-full grow relative">
          {!isSM && image && (
            <img
              src={image}
              className="w-full h-full absolute object-contain"
              alt="background"
            />
          )}
          <div className="w-full h-full grid place-items-center absolute">
            <div className="flex gap-4">
              <ViewFinishButton
                label={t("share")}
                icon={<Icon color="white" name="share" />}
                onClick={openShareDialog}
              />
              {viewStart?.documents?.length && (
                <ViewFinishButton
                  label={t("files")}
                  icon={<Icon color="white" name="folder" />}
                  onClick={openFilesDialog}
                />
              )}
              <ViewFinishButton
                label={t("replay")}
                icon={<Icon color="white" name="replay" />}
                onClick={replay}
              />
              {isSM && (
                <ViewFinishButton
                  label={t("info")}
                  icon={<Icon color="white" name="info" />}
                  onClick={openFinishInfoDialog}
                />
              )}
            </div>
          </div>
        </div>

        <div className="h-full bg-white p-8 shadow-md hidden md:block md:w-[400px]">
          <ViewFinishInfo viewExpo={viewExpo} viewStart={viewStart} />
        </div>
      </div>
    </>
  );
};
