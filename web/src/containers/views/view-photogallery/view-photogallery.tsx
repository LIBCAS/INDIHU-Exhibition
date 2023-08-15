import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";
import useElementSize from "hooks/element-size-hook";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Components
import { Grid } from "@mui/material";
import ImageItem from "./ImageItem";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { AppState } from "store/store";
import { AppDispatch } from "store/store";
import { PhotogalleryScreen, ScreenProps } from "models";

// Utils
import cx from "classnames";
import { setScreensInfo } from "actions/expoActions/viewer-actions";
import classes from "./gallery-overlay.module.scss";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as PhotogalleryScreen,
  (viewScreen) => ({ viewScreen })
);

// - -

export const ViewPhotogallery = ({ screenPreloadedFiles }: ScreenProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const { images } = screenPreloadedFiles;

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const [imgContainerRef, imgContainerSize] = useElementSize();

  // -- Style of grid based on number of total photos --
  const isLessPhotos = images ? images.length <= 8 : true;

  // -- Lightbox stuff --
  const isLightBoxOpened = useMemo(
    () => selectedImageIndex !== null,
    [selectedImageIndex]
  );

  const opacityAnimation = useSpring({
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
  }, [selectedImageIndex]);

  const nextPhoto = useCallback(() => {
    if (
      !images ||
      selectedImageIndex === images.length - 1 ||
      selectedImageIndex === null
    ) {
      return;
    }
    setSelectedImageIndex((prev) => (prev !== null ? prev + 1 : prev));
  }, [images, selectedImageIndex]);

  // -- Key Press handler --
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

  useEffect(() => {
    document.addEventListener("keydown", onKeydownAction);
    return () => {
      document.removeEventListener("keydown", onKeydownAction);
    };
  }, [onKeydownAction]);

  return (
    <div className="w-full h-full relative">
      {/* Gallery always rendered */}
      <div
        className="w-full h-full py-[5%] px-[7.5%]"
        style={{
          backgroundColor: isLightBoxOpened ? "black" : undefined,
          opacity: isLightBoxOpened ? 0.1 : undefined,
        }}
      >
        <Grid
          container
          spacing={{ xs: 3, sm: 3, lg: 3 }}
          className="w-full h-full overflow-y-auto expo-scrollbar"
          sx={{ overflowX: "hidden", paddingRight: 3 }}
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
      {images && selectedImageIndex !== null && isLightBoxOpened && (
        <animated.div style={opacityAnimation}>
          <div
            key={selectedImageIndex}
            className="absolute top-0 left-0 w-full h-full px-[7%] py-[4.5%]"
          >
            <div className="w-full h-full flex">
              <div
                ref={imgContainerRef}
                style={{ width: "calc(100% - 32px)", height: "100%" }}
                className="flex justify-center items-center"
              >
                <TransformWrapper disablePadding>
                  <TransformComponent
                    wrapperStyle={{
                      maxWidth: `${imgContainerSize.width}px`,
                      maxHeight: `${imgContainerSize.height}px`,
                    }}
                    contentStyle={{
                      maxWidth: `${imgContainerSize.width}px`,
                      maxHeight: `${imgContainerSize.height}px`,
                    }}
                  >
                    <img
                      src={images[selectedImageIndex]}
                      alt="lightbox-image"
                      style={{
                        maxWidth: `${imgContainerSize.width}px`,
                        maxHeight: `${imgContainerSize.height}px`,
                      }}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>

              <div className="w-[32px] self-start flex justify-center items-center">
                <Button noPadding>
                  <Icon
                    color="white"
                    useMaterialUiIcon
                    name="close"
                    onClick={closeLightBox}
                    style={{ fontSize: "24px" }}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Arrows */}
          <div
            className={cx(
              classes.overlay,
              "hidden sm:grid fixed left-0 top-0 w-full h-full pointer-events-none"
            )}
          >
            <div className={cx(classes.leftNav)}>
              <div className="w-full h-full flex items-center">
                <Button
                  color="white"
                  className="rounded-full pointer-events-auto"
                  onClick={prevPhoto}
                >
                  <Icon name="chevron_left" />
                </Button>
              </div>
            </div>
            <div className={cx(classes.rightNav)}>
              <div className="w-full h-full flex items-center justify-end">
                <Button
                  color="white"
                  className="rounded-full pointer-events-auto"
                  onClick={nextPhoto}
                >
                  <Icon name="chevron_right" />
                </Button>
              </div>
            </div>
          </div>
        </animated.div>
      )}
    </div>
  );
};
