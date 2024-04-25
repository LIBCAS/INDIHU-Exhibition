import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";
import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { useSwipeable } from "react-swipeable";

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

// Utils
import cx from "classnames";
import classes from "./gallery-overlay.module.scss";
import { setScreensInfo } from "actions/expoActions/viewer-actions";
import { OVERLAY_UNACTIVE_TIMEOUT } from "constants/screen";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as PhotogalleryScreen,
  (viewScreen) => ({ viewScreen })
);

// - -

export const ViewPhotogallery = ({ screenPreloadedFiles }: ScreenProps) => {
  const { images } = screenPreloadedFiles;
  const { viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const { closeAllDialogs } = useDialogRef();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const [isActivity, setIsActivity] = useState<boolean>(false); // photogallery overlay
  const timeoutRef = useRef<NodeJS.Timeout>();

  const overlayOpacityAnimation = useSpring({
    opacity: isActivity ? 1 : 0,
  });

  // -- Style of grid based on number of total photos --
  const isLessPhotos = images ? images.length <= 6 : true;

  // 2. - - - Lightbox stuff - - -
  const isLightBoxOpened = useMemo(
    () => selectedImageIndex !== null,
    [selectedImageIndex]
  );

  const lightboxOpacityAnimation = useSpring({
    opacity: isLightBoxOpened ? 1 : 0,
  });

  const openLightBox = useCallback(
    (selectedImageIndex: number) => {
      dispatch(setScreensInfo({ isPhotogalleryLightboxOpened: true }));
      setSelectedImageIndex(selectedImageIndex);
    },
    [dispatch]
  );

  const closeLightBox = useCallback(() => {
    dispatch(setScreensInfo({ isPhotogalleryLightboxOpened: false }));
    setSelectedImageIndex(null);
  }, [dispatch]);

  const prevPhoto = useCallback(() => {
    if (selectedImageIndex === 0 || selectedImageIndex === null) {
      return;
    }
    setSelectedImageIndex((prev) => (prev !== null ? prev - 1 : prev));
    closeAllDialogs();
  }, [selectedImageIndex, closeAllDialogs]);

  const nextPhoto = useCallback(() => {
    if (
      !images ||
      selectedImageIndex === images.length - 1 ||
      selectedImageIndex === null
    ) {
      return;
    }
    setSelectedImageIndex((prev) => (prev !== null ? prev + 1 : prev));
    closeAllDialogs();
  }, [images, selectedImageIndex, closeAllDialogs]);

  // 3. - - - Key press and mouse handlers - - -
  const onKeydownAction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isLightBoxOpened) {
        closeLightBox();
      }
      if (event.key === "ArrowRight" && isLightBoxOpened) {
        nextPhoto();
      }
      if (event.key === "ArrowLeft" && isLightBoxOpened) {
        prevPhoto();
      }
    },
    [closeLightBox, isLightBoxOpened, nextPhoto, prevPhoto]
  );

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

  useEffect(() => {
    if (isLightBoxOpened && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightBoxOpened, timeoutRef.current]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      nextPhoto();
    },
    onSwipedRight: () => {
      prevPhoto();
    },
    delta: 80,
  });

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
        selectedImageIndex !== null &&
        isLightBoxOpened && (
          <animated.div style={lightboxOpacityAnimation}>
            <div
              key={selectedImageIndex}
              className="absolute top-0 left-0 w-full h-full px-[7%] py-[4.5%]"
              {...swipeHandlers}
            >
              <LightBox
                key={`lightbox-image-${selectedImageIndex}`}
                currPhotoSrc={images[selectedImageIndex]}
                currPhotoObj={viewScreen.images[selectedImageIndex]}
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
              {selectedImageIndex !== 0 && (
                <div className={cx(classes.leftNav)}>
                  <div className="w-full h-full flex items-center">
                    <Button
                      color="expoTheme"
                      className="rounded-full pointer-events-auto"
                      onClick={prevPhoto}
                    >
                      <Icon name="chevron_left" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedImageIndex !== images.length - 1 && (
                <div className={cx(classes.rightNav)}>
                  <div className="w-full h-full flex items-center justify-end">
                    <Button
                      color="expoTheme"
                      className="rounded-full pointer-events-auto"
                      onClick={nextPhoto}
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
