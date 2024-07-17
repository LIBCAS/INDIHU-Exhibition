import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { createSelector } from "reselect";

import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";
import DialogPortal from "context/dialog-ref-provider/DialogPortal";

import useElementSize from "hooks/element-size-hook";
import useResizeObserver from "hooks/use-resize-observer";
import { useExpoNavigation } from "hooks/view-hooks/expo-navigation-hook";
import { useViewStartAnimation } from "./view-start-animation-hook";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

// Components
import { Snackbar, Alert } from "@mui/material";

import StartInfoPanel from "./StartInfoPanel";
import StartDetailPanel from "./StartDetailPanel";
import StartButton from "./StartButton";

import { ExpoInfoDialog } from "components/dialogs/expo-info-dialog/expo-info-dialog";
import { ChaptersDialog } from "components/dialogs/chapters-dialog/chapters-dialog";
import { FilesDialog } from "components/dialogs/files-dialog/files-dialog";
import { WorksheetsDialog } from "components/dialogs/worksheets-dialog/worksheets-dialog";

// Models
import { AppDispatch, AppState } from "store/store";
import { ViewExpo, StartScreen, ScreenProps } from "models";

// Utils and actions
import { setViewProgress } from "actions/expoActions/viewer-actions";
import { calculateObjectFit } from "utils/object-fit";
import { calculateLogoPosition } from "./calculateLogoPosition";
import ExpoAuthorsDialog from "components/dialogs/expo-authors-dialog/expo-authors-dialog";

// - - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo as ViewExpo,
  ({ expo }: AppState) => expo.viewScreen as StartScreen,
  (viewExpo, viewScreen) => ({ viewExpo, viewScreen })
);

export const ViewStart = ({ screenPreloadedFiles }: ScreenProps) => {
  const { t } = useTranslation("view-exhibition");

  const { image } = screenPreloadedFiles ?? {}; // background image, if set
  const { viewExpo, viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const { expoDesignData } = useExpoDesignData();
  const { navigateForward } = useExpoNavigation();

  const { isMobile, isTablet, isDesktop } = useMediaDevice();

  const {
    openNewTopDialog,
    closeTopDialog,
    closeAllDialogs,
    isExpoInfoDialogOpen,
    isChaptersDialogOpen,
    isFilesDialogOpen,
    isWorksheetDialogOpen,
    isExpoAuthorsDialogOpen,
  } = useDialogRef();

  const animationProps = useViewStartAnimation(viewScreen?.animationType);
  const animationStyles = useSpring(animationProps);

  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState<boolean>(false);

  const [screenContainerRef, screenContainerSize] = useElementSize();
  const [infoPanelRef, infoPanelSize] = useResizeObserver({
    ignoreUpdate: true,
  });

  const [isLandscapeRecommendationOpen, setIsLandscapeRecommendationOpen] =
    useState<boolean>(isMobile ? true : false);

  const [isAudioWarningSnackbarOpen, setIsAudioWarningSnackbarOpen] =
    useState<boolean>(isMobile ? true : false);

  // - -

  const imageOrigData = useMemo(() => {
    const imageOrigData = viewScreen.imageOrigData ?? { width: 0, height: 0 };
    return imageOrigData;
  }, [viewScreen.imageOrigData]);

  const {
    width: containedBgImageWidth,
    height: containedBgImageHeight,
    left: fromContainerToBgImageLeft,
    top: fromContainerToBgImageTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: screenContainerSize,
        child: imageOrigData,
        type: "contain",
      }),
    [imageOrigData, screenContainerSize]
  );

  // - -

  const { infoHeight } = useSpring({
    infoHeight: isInfoPanelOpen ? "50%" : "0%",
    config: { duration: 250 },
  });

  const { detailsHeight } = useSpring({
    detailsHeight: isDetailPanelOpen ? "50%" : "0%",
    config: { duration: 250 },
  });

  // - -

  const handleStart = useCallback(async () => {
    await dispatch(setViewProgress({ shouldIncrement: true }));
    navigateForward();
  }, [dispatch, navigateForward]);

  const openMobileInfoDialog = useCallback(
    () => openNewTopDialog(DialogRefType.ExpoInfoDialog),
    [openNewTopDialog]
  );

  const openChaptersDialog = useCallback(
    () => openNewTopDialog(DialogRefType.ChaptersDialog),
    [openNewTopDialog]
  );

  const openFilesDialog = useCallback(
    () => openNewTopDialog(DialogRefType.FilesDialog),
    [openNewTopDialog]
  );

  const openWorksheetsDialog = useCallback(
    () => openNewTopDialog(DialogRefType.WorksheetDialog),
    [openNewTopDialog]
  );

  return (
    <>
      {/* a) Background image */}
      <div className="h-full w-full" ref={screenContainerRef}>
        <animated.div
          className="flex justify-center items-center h-full w-full"
          style={animationStyles}
        >
          {image && (
            <img
              className="h-full w-full object-contain"
              src={image}
              alt="background"
            />
          )}
        </animated.div>
      </div>

      {/* LOGO if set */}
      {expoDesignData &&
        expoDesignData.logoFile &&
        expoDesignData.logoType &&
        expoDesignData.logoPosition && (
          <div className="absolute left-0 top-0 w-full h-full">
            <img
              src={`/api/files/${expoDesignData.logoFile.fileId}`}
              alt="logo-image"
              className="absolute"
              style={{
                opacity:
                  expoDesignData.logoType === "WATERMARK" ? 0.5 : undefined,
                ...calculateLogoPosition(
                  expoDesignData.logoPosition,
                  {
                    width: containedBgImageWidth,
                    height: containedBgImageHeight,
                  },
                  {
                    left: fromContainerToBgImageLeft,
                    top: fromContainerToBgImageTop,
                  },
                  infoPanelSize
                ),
              }}
            />
          </div>
        )}

      {/* b) Flex container with 2 items, left Info panel, right Detail panel with start button (on top of bg image) */}
      <div className="fixed top-0 left-0 h-full w-full flex px-4 pt-4 gap-4">
        {isMobile && (
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex flex-col justify-end">
              <StartButton handleStart={handleStart} />
              <StartInfoPanel
                viewExpo={viewExpo}
                viewScreen={viewScreen}
                isInfoPanelOpen={isInfoPanelOpen}
                setIsInfoPanelOpen={setIsInfoPanelOpen}
                openMobileInfoDialog={openMobileInfoDialog}
                openChaptersDialog={openChaptersDialog}
              />
            </div>
          </div>
        )}

        {isTablet && (
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex justify-self-end gap-4" ref={infoPanelRef}>
              <StartInfoPanel
                viewExpo={viewExpo}
                viewScreen={viewScreen}
                isInfoPanelOpen={isInfoPanelOpen}
                setIsInfoPanelOpen={setIsInfoPanelOpen}
                openMobileInfoDialog={openMobileInfoDialog}
                openChaptersDialog={openChaptersDialog}
              />
              <StartButton handleStart={handleStart} />
            </div>
          </div>
        )}

        {isDesktop && (
          <>
            <div className="flex-1 flex flex-col justify-end">
              <div className="h-36" />
              <animated.div
                style={{ height: infoHeight, minHeight: "13rem" }}
                ref={infoPanelRef}
              >
                <StartInfoPanel
                  viewExpo={viewExpo}
                  viewScreen={viewScreen}
                  isInfoPanelOpen={isInfoPanelOpen}
                  setIsInfoPanelOpen={setIsInfoPanelOpen}
                  openMobileInfoDialog={openMobileInfoDialog}
                  openChaptersDialog={openChaptersDialog}
                />
              </animated.div>
            </div>

            {/* Detail panel + Start button */}
            <div className="flex-1 flex flex-col justify-end">
              <StartButton handleStart={handleStart} />
              <animated.div
                className="flex flex-col"
                style={{ height: detailsHeight, minHeight: "13rem" }}
              >
                <StartDetailPanel
                  viewScreen={viewScreen}
                  isDetailPanelOpen={isDetailPanelOpen}
                  setIsDetailPanelOpen={setIsDetailPanelOpen}
                  openFilesDialog={openFilesDialog}
                  openWorksheetsDialog={openWorksheetsDialog}
                />
              </animated.div>
            </div>
          </>
        )}
      </div>

      {isExpoInfoDialogOpen && (
        <DialogPortal
          component={
            <ExpoInfoDialog
              closeThisDialog={closeTopDialog}
              viewExpo={viewExpo}
              viewScreen={viewScreen}
            />
          }
        />
      )}

      {isChaptersDialogOpen && (
        <DialogPortal
          component={
            <ChaptersDialog
              closeThisDialog={closeTopDialog}
              screens={viewExpo.structure.screens}
              viewExpoUrl={viewExpo.url}
              onClick={closeAllDialogs}
            />
          }
        />
      )}

      {isFilesDialogOpen && (
        <DialogPortal
          component={
            <FilesDialog
              closeThisDialog={closeTopDialog}
              files={viewScreen?.documents}
            />
          }
        />
      )}

      {isWorksheetDialogOpen && (
        <DialogPortal
          component={
            <WorksheetsDialog
              closeThisDialog={closeTopDialog}
              files={viewScreen?.documents}
            />
          }
        />
      )}

      {isExpoAuthorsDialogOpen && (
        <DialogPortal
          component={
            <ExpoAuthorsDialog
              closeThisDialog={closeTopDialog}
              collaboratorsData={viewScreen.collaborators}
            />
          }
        />
      )}

      {/* Mobile snackbar for recommendation to turn the mobile into landscape mode */}
      <Snackbar
        open={isLandscapeRecommendationOpen}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert
          severity="info"
          onClose={() => setIsLandscapeRecommendationOpen(false)}
        >
          {t("landscapeModeRecommendation")}
        </Alert>
      </Snackbar>

      {/* Mobile snackbar for warning that after every screen change, the expo needs to be stopped, 
      because without user interaction, the audio tracks can not start playing */}
      <Snackbar
        open={isAudioWarningSnackbarOpen}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        style={{ top: isLandscapeRecommendationOpen ? "76px" : undefined }}
      >
        <Alert
          severity="info"
          onClose={() => setIsAudioWarningSnackbarOpen(false)}
        >
          {t("audioWarningSnackbarText")}
        </Alert>
      </Snackbar>
    </>
  );
};
