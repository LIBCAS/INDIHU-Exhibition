import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";
import { useSwipeable } from "react-swipeable";

// Custom hooks
import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";

// Components
import { Grid } from "@mui/material";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import ImageItem from "./ImageItem";
import LightBox from "./Lightbox";

// Models
import { AppState } from "store/store";
import { AppDispatch } from "store/store";
import { PhotogalleryScreen, ScreenProps } from "models";

// Redux (actions)
import { setScreensInfo } from "actions/expoActions/viewer-actions";

// Utils
import cx from "classnames";
import classes from "./gallery-overlay.module.scss";
import { OVERLAY_UNACTIVE_TIMEOUT } from "constants/screen";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as PhotogalleryScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - - - -

export const ViewPhotogallery = ({ screenPreloadedFiles }: ScreenProps) => {
  const { images } = screenPreloadedFiles;
  const { viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const { closeAllDialogs } = useDialogRef();

  // - - - States - - -

  const [selectedImgIdx, setSelectedImgIdx] = useState<number | null>(null);
  const [isActivity, setIsActivity] = useState<boolean>(false); // NOTE: For photogallery overlay

  const timeoutRef = useRef<NodeJS.Timeout>();

  // - - - Derived variables - - -

  const isLessPhotos = images ? images.length <= 6 : true;

  const isLightBoxOpened = useMemo(
    () => selectedImgIdx !== null,
    [selectedImgIdx]
  );

  // - - - Springs - - -

  const overlayOpacityAnimation = useSpring({
    opacity: isActivity ? 1 : 0,
  });

  const lightboxOpacityAnimation = useSpring({
    opacity: isLightBoxOpened ? 1 : 0,
  });

  // - - - Callbacks - - -

  /**
   *
   */
  const openLightBox = useCallback(
    (selectedImageIndex: number) => {
      dispatch(setScreensInfo({ isPhotogalleryLightboxOpened: true }));
      setSelectedImgIdx(selectedImageIndex);
    },
    [dispatch]
  );

  /**
   *
   */
  const closeLightBox = useCallback(() => {
    dispatch(setScreensInfo({ isPhotogalleryLightboxOpened: false }));
    setSelectedImgIdx(null);
    closeAllDialogs();
  }, [dispatch, closeAllDialogs]);

  /**
   *
   */
  const switchToPreviousPhoto = useCallback(() => {
    if (selectedImgIdx === 0 || selectedImgIdx === null) {
      return;
    }
    setSelectedImgIdx((prev) => (prev !== null ? prev - 1 : prev));
    closeAllDialogs();
  }, [selectedImgIdx, closeAllDialogs]);

  /**
   *
   */
  const switchToNextPhoto = useCallback(() => {
    if (
      !images ||
      selectedImgIdx === images.length - 1 ||
      selectedImgIdx === null
    ) {
      return;
    }
    setSelectedImgIdx((prev) => (prev !== null ? prev + 1 : prev));
    closeAllDialogs();
  }, [images, selectedImgIdx, closeAllDialogs]);

  // - - - Keyboard and mouse handlers - - -

  /**
   *
   */
  const onKeydownAction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isLightBoxOpened) {
        closeLightBox();
      }
      if (event.key === "ArrowRight" && isLightBoxOpened) {
        switchToNextPhoto();
      }
      if (event.key === "ArrowLeft" && isLightBoxOpened) {
        switchToPreviousPhoto();
      }
    },
    [isLightBoxOpened, closeLightBox, switchToNextPhoto, switchToPreviousPhoto]
  );

  /**
   *
   */
  const onMouseAction = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsActivity(true);

    if (!isLightBoxOpened) {
      const timeout = setTimeout(
        () => setIsActivity(false),
        OVERLAY_UNACTIVE_TIMEOUT
      );
      timeoutRef.current = timeout;
    }
  }, [isLightBoxOpened]);

  /**
   *
   */
  useEffect(() => {
    document.addEventListener("keydown", onKeydownAction);
    document.addEventListener("mousemove", onMouseAction);
    document.addEventListener("mousedown", onMouseAction);
    return () => {
      document.removeEventListener("keydown", onKeydownAction);
      document.removeEventListener("mousemove", onMouseAction);
      document.removeEventListener("mousedown", onMouseAction);
    };
  }, [onKeydownAction, onMouseAction]);

  /**
   *
   */
  useEffect(() => {
    if (isLightBoxOpened && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightBoxOpened, timeoutRef.current]);

  // - - - Swipe handlers - - -

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      switchToNextPhoto();
    },
    onSwipedRight: () => {
      switchToPreviousPhoto();
    },
    delta: 80,
    trackTouch: true,
    trackMouse: true,
  });

  // - - - GUI - - -

  return (
    <div className="w-full h-full relative">
      {/* Gallery always rendered */}
      <div
        className="w-full h-full pl-[7.5%] pr-[5%] py-[5%] 2xl:pr-[5.9%]"
        style={{
          backgroundColor: isLightBoxOpened ? "black" : undefined,
          opacity: isLightBoxOpened ? 0.05 : undefined,
        }}
      >
        <Grid
          container
          spacing={{ xs: 3, sm: 3, lg: 3 }}
          className="w-full h-full overflow-x-hidden overflow-y-auto expo-scrollbar pr-[2.5%] 2xl:pr-[1.6%]"
        >
          {images?.map((imageBlobSrc, imageIndex) => (
            <ImageItem
              key={imageIndex}
              imageUrl={imageBlobSrc}
              imageIndex={imageIndex}
              openLightBox={openLightBox}
              isLessPhotos={isLessPhotos}
            />
          ))}
        </Grid>
      </div>

      {/* Lightbox which is opened on some image click */}
      {images &&
        viewScreen.images &&
        selectedImgIdx !== null &&
        isLightBoxOpened && (
          <animated.div style={lightboxOpacityAnimation}>
            <div
              key={selectedImgIdx}
              className="absolute top-0 left-0 w-full h-full px-[7%] py-[4.5%]"
              {...swipeHandlers}
            >
              <LightBox
                key={`lightbox-image-${selectedImgIdx}`}
                currPhotoSrc={images[selectedImgIdx]}
                currPhotoObj={viewScreen.images[selectedImgIdx]}
                closeLightBox={closeLightBox}
                overlayOpacityAnimation={overlayOpacityAnimation}
              />
            </div>

            {/* Arrows */}
            <animated.div
              className={cx(
                classes.overlay,
                "hidden sm:grid fixed left-0 top-0 w-full h-full pointer-events-none"
              )}
              style={{ opacity: overlayOpacityAnimation.opacity }}
            >
              {selectedImgIdx !== 0 && (
                <div className={cx(classes.leftNav)}>
                  <div className="w-full h-full flex items-center">
                    <Button
                      color="expoTheme"
                      className="rounded-full pointer-events-auto"
                      onClick={switchToPreviousPhoto}
                    >
                      <Icon name="chevron_left" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedImgIdx !== images.length - 1 && (
                <div className={cx(classes.rightNav)}>
                  <div className="w-full h-full flex items-center justify-end">
                    <Button
                      color="expoTheme"
                      className="rounded-full pointer-events-auto"
                      onClick={switchToNextPhoto}
                    >
                      <Icon name="chevron_right" />
                    </Button>
                  </div>
                </div>
              )}
            </animated.div>
          </animated.div>
        )}
    </div>
  );
};
