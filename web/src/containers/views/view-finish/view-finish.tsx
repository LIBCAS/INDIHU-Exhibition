import { useCallback, useEffect, useMemo } from "react";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "hooks/use-local-storage";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";
import DialogPortal from "context/dialog-ref-provider/DialogPortal";

// Custom hooks
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

// Components
import { ViewFinishInfo } from "./view-finish-info"; // authors panel
import { ViewFinishButton } from "./view-finish-button"; // squared button with the icon in the middle
import { Icon } from "components/icon/icon";

import { ShareExpoDialog } from "components/dialogs/share-expo-dialog/share-expo-dialog";
import { FinishAllFilesDialog } from "components/dialogs/finish-all-files-dialog/finish-all-files-dialog";
import { FinishInfoDialog } from "components/dialogs/finish-info-dialog/finish-info-dialog";
import { RatingDialog } from "components/dialogs/rating-dialog/rating-dialog";
import { InformationDialog } from "components/dialogs/information-dialog/information-dialog";

// Models
import { AppDispatch, AppState } from "store/store";
import { Screen, ScreenWithOnlyTypeTitleDocuments, ExpoRates } from "models";
import { ScreenProps } from "models";

import cx from "classnames";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({ viewExpo })
);

// - -

export const ViewFinish = ({
  screenPreloadedFiles,
  chapterMusicRef,
}: Omit<ScreenProps, "infoPanelRef">) => {
  const { viewExpo } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation(["view-exhibition", "view-screen"]);

  const { bgFgTheming } = useExpoDesignData();

  const { url } = viewExpo ?? {};
  const { image } = screenPreloadedFiles;

  const { isMobile, isLg } = useMediaDevice();

  const { push } = useHistory();

  const {
    openNewTopDialog,
    closeTopDialog,
    closeAllDialogs,
    isShareExpoDialogOpen,
    isFinishAllFilesDialogOpen,
    isFinishInfoDialogOpen,
    isRatingDialogOpen,
    isInformationDialogOpen,
  } = useDialogRef();

  const [expoRates, setExpoRates] = useLocalStorage<ExpoRates>(
    `isExpoRated`,
    {}
  );

  const isExpoAlreadyRated = useMemo(
    () => !!viewExpo?.id && !!expoRates[viewExpo.id],
    [expoRates, viewExpo?.id]
  );

  // - - - - - - - -

  // Preparing structure of files for FilesDialog
  // Array of .documents only for 'START' type of screen
  const structureStartFiles = useMemo(
    () => viewExpo?.structure.start.documents,
    [viewExpo?.structure.start.documents]
  );

  // 2D array like [ [chapter0 documents], [chapter1 documents], ... ]
  const structureScreenFiles = useMemo(() => {
    const structureScreenFiles:
      | ScreenWithOnlyTypeTitleDocuments[][]
      | undefined = viewExpo?.structure.screens.map(
      (actChapterScreens: Screen[]) => {
        const returnedArr = actChapterScreens.map((actScreen: Screen) => {
          const obj = {
            title: actScreen.title,
            type: actScreen.type,
          };

          if ("documents" in actScreen) {
            return {
              ...obj,
              documents: actScreen.documents,
            };
          }
          return obj;
        });

        return returnedArr;
      }
    );

    return structureScreenFiles;
  }, [viewExpo?.structure.screens]);

  // - - - - - - - -

  useEffect(() => {
    if (!chapterMusicRef) {
      return;
    }
    chapterMusicRef.pause();
    chapterMusicRef.currentTime = 0;
  }, [dispatch, chapterMusicRef]);

  const viewStart = useMemo(
    () => viewExpo?.structure.start,
    [viewExpo?.structure.start]
  );

  // - -

  const openRatingDialog = useCallback(
    () => openNewTopDialog(DialogRefType.RatingDialog),
    [openNewTopDialog]
  );

  const openInformationFailDialog = useCallback(
    () => openNewTopDialog(DialogRefType.InformationDialog),
    [openNewTopDialog]
  );

  // - - - - - - - - -

  // 1) Clicking on first share icon will open the share dialog
  const openShareDialog = useCallback(
    () => openNewTopDialog(DialogRefType.ShareExpoDialog),
    [openNewTopDialog]
  );

  // 2) Clicking on second files of exposition will open the files dialog
  const openFilesDialog = useCallback(() => {
    if (!structureStartFiles || !structureScreenFiles) {
      return;
    }
    openNewTopDialog(DialogRefType.FinishAllFilesDialog);
  }, [openNewTopDialog, structureScreenFiles, structureStartFiles]);

  // 3) Clicking on third replay icon will redirect the user back to the start screen
  const replay = useCallback(() => push(`/view/${url}/start`), [push, url]);

  // 4) Clicking on fourth info icon will open the FinishInfoDialog
  // This icon button is visible only on small screens
  const openFinishInfoDialog = useCallback(
    () => openNewTopDialog(DialogRefType.FinishInfoDialog),
    [openNewTopDialog]
  );

  return (
    <>
      {/* Image on small screen */}
      {isMobile && image && (
        <img
          src={image}
          className="w-full h-full absolute object-contain"
          alt="background"
        />
      )}

      <div className="absolute w-full h-full flex">
        <div className="relative h-full grow">
          {!isMobile && image && (
            <img
              src={image}
              className="absolute w-full h-full object-contain"
              alt="finish-screen-background-image"
            />
          )}

          <div className="absolute w-full h-full flex justify-center items-center">
            <div className="flex flex-wrap justify-center items-start gap-y-4">
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

              {isLg && (
                <ViewFinishButton
                  label={t("rate-expo")}
                  icon={<Icon color="white" name="star" />}
                  onClick={openRatingDialog}
                />
              )}

              {isLg && (
                <ViewFinishButton
                  label={t("info")}
                  icon={<Icon color="white" name="info" />}
                  onClick={openFinishInfoDialog}
                />
              )}
            </div>
          </div>
        </div>

        <div
          className={cx(
            "hidden lg:block lg:w-[400px] h-full py-8 pl-8 pr-8 bg-white shadow-md overflow-auto expo-scrollbar",
            bgFgTheming
          )}
        >
          <ViewFinishInfo
            viewExpo={viewExpo}
            viewStart={viewStart}
            openInformationFailDialog={openInformationFailDialog}
            setExpoRates={setExpoRates}
            isExpoAlreadyRated={isExpoAlreadyRated}
          />
        </div>
      </div>

      {isShareExpoDialogOpen && (
        <DialogPortal
          component={
            <ShareExpoDialog
              closeThisDialog={closeTopDialog}
              url={`${window.location.origin}/view/${url}`}
              expoTitle={viewExpo?.title}
            />
          }
        />
      )}

      {isFinishAllFilesDialogOpen &&
        structureStartFiles &&
        structureScreenFiles && (
          <DialogPortal
            component={
              <FinishAllFilesDialog
                closeThisDialog={closeTopDialog}
                startFiles={structureStartFiles}
                screensFiles={structureScreenFiles}
              />
            }
          />
        )}

      {isFinishInfoDialogOpen && (
        <DialogPortal
          component={
            <FinishInfoDialog
              closeThisDialog={closeTopDialog}
              viewExpo={viewExpo}
              viewStart={viewStart}
            />
          }
        />
      )}

      {isRatingDialogOpen && isExpoAlreadyRated && (
        <DialogPortal
          component={
            <InformationDialog
              closeThisDialog={closeTopDialog}
              title={t("rating.expoAlreadyRatedTitle", { ns: "view-screen" })}
              content={t("rating.expoAlreadyRatedText", { ns: "view-screen" })}
              big
            />
          }
        />
      )}

      {isRatingDialogOpen && !isExpoAlreadyRated && viewExpo?.id && (
        <DialogPortal
          component={
            <RatingDialog
              closeThisDialog={closeTopDialog}
              openInformationFailDialog={openInformationFailDialog}
              expoId={viewExpo.id}
              setExpoRates={setExpoRates}
            />
          }
        />
      )}

      {/* when rating has failed */}
      {isInformationDialogOpen && (
        <DialogPortal
          component={
            <InformationDialog
              closeThisDialog={closeAllDialogs}
              title={t("rating.ratingFailureTitle", { ns: "view-screen" })}
              content={t("rating.expoAlreadyRatedText", { ns: "view-screen" })}
              big={false}
            />
          }
        />
      )}
    </>
  );
};
