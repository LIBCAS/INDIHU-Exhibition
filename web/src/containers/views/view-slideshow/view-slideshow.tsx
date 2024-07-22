import { useEffect, useMemo, useState, useCallback, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { animated, useTransition } from "react-spring";
import { useCountdown } from "hooks/countdown-hook";
import useResizeObserver from "hooks/use-resize-observer";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";
import { useGlassMagnifier } from "hooks/view-hooks/glass-magnifier-hook/useGlassMagnifier";

import { AppState } from "store/store";
import { Position, ScreenProps, SlideshowScreen } from "models";

import {
  setViewProgress,
  setTooltipInfo,
} from "actions/expoActions/viewer-actions";

import { getScreenTime } from "utils/screen";
import { calculateObjectFit } from "utils/object-fit";
import { resolveSlideshowAnimation } from "./view-slideshow-animation";
import { calculateInfopointPosition } from "utils/infopoint-utils";

// - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as SlideshowScreen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({ viewScreen, viewProgress })
);

// - - - -

export const ViewSlideshow = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, viewProgress } = useSelector(stateSelector);
  const dispatch = useDispatch();

  const { images = [] } = screenPreloadedFiles; // from all screenPreloadedFiles just take screenPreloadedFiles.images (all photos as blob:)

  const [photoIndex, setPhotoIndex] = useState(0); // order of the current photo from slideshow
  const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(false); // photos transition animation

  // - - -

  // Container here is parent, { width, height } in pixels of the whole available screen container
  const [containerRef, containerSize, containerEl] = useResizeObserver();
  const [photoImgEl, setPhotoImgEl] = useState<HTMLImageElement | null>(null);

  const { GlassMagnifier } = useGlassMagnifier(containerEl, photoImgEl);

  // ImageOrigData here is child, { width, height } in pixels of the image from administration, infopoints are placed based on these coords
  const imageOrigData = useMemo(() => {
    const origData = viewScreen.images?.[photoIndex]?.imageOrigData;
    if (!origData) {
      return { width: 0, height: 0 };
    }
    return origData;
  }, [photoIndex, viewScreen.images]);

  // calculateObjectFit, based on parent and child { width, height } coords, will compute:
  // { width, height } of the contained image, which is placed in middle (either horizontally or vertically)
  // e.g container (parent) = { width: 1500, height: 500 }, imageOrigData (child) = { width: 2000, height: 500 }
  // then contained image = { width: 1500, height: 375 }, thus in the middle vertically
  // container height 500 - contained image height 375 = 125 px free space
  // so height will be like 62.5 px space + contained image 375px + 62.5 px space
  // width be 0px + contained image 1500px + 0px
  // so fromTopHeight will be 62.5px since in middle vertically, and fromLeftWidth will be zero
  const {
    width: containedImageWidth,
    height: containedImageHeight,
    top: fromTopHeight,
    left: fromLeftWidth,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: imageOrigData,
      }),
    [containerSize, imageOrigData]
  );

  // - - - -

  const {
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints,
    AnchorInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  // - - - -

  const isTimePhotosManual = useMemo(
    () => viewScreen.timePhotosManual ?? false,
    [viewScreen]
  );

  const time = useMemo(() => getScreenTime(viewScreen), [viewScreen]);

  const evenlyDividedTime = useMemo(
    () => time / images.length,
    [images.length, time]
  );

  // Helper variable containing same information as a state above
  const photosTimes = useMemo<number[]>(() => {
    if (!viewScreen?.images) {
      return [];
    }

    if (isTimePhotosManual) {
      const times = viewScreen.images.reduce<number[]>(
        (acc, currValue) => [
          ...acc,
          currValue.time ? currValue.time * 1000 : 5000,
        ],
        []
      );
      return times;
    }

    return Array(viewScreen.images.length).fill(evenlyDividedTime);
  }, [viewScreen.images, isTimePhotosManual, evenlyDividedTime]);

  // Containing actual information of the remaining time of each photo from slideshow
  // Can be manually set (e.g when clicking on progressbar) to edit actual timestamps, cause rerendering
  const [photosTimesArr, setPhotosTimesArr] = useState<number[]>(() => {
    return photosTimes;
  });

  useEffect(() => {
    if (photosTimes.length !== 0) {
      setPhotosTimesArr(photosTimes);
      dispatch(setViewProgress({ rewindToTime: 0 }));
    }
  }, [photosTimes, dispatch]);

  // One countdown for each photo in slideshow.. after finished, setIndex to next photo
  const { resetCountdown } = useCountdown(photosTimesArr[photoIndex], {
    isPaused: !viewProgress.shouldIncrement,
    onFinish: () => {
      setPhotoIndex((prev) => (prev + 1) % (viewScreen.images?.length ?? 1));
      resetCountdown();
    },
  });

  // - - -

  const type = viewScreen.animationType;
  const animation = useMemo(() => resolveSlideshowAnimation(type), [type]);

  const transitionProps = useMemo(
    () => ({ ...animation, paused: !viewProgress.shouldIncrement }),
    [animation, viewProgress.shouldIncrement]
  );

  const transition = useTransition(photoIndex, {
    ...transitionProps,
    onStart: () => setIsAnimationRunning(true),
    onRest: () => setIsAnimationRunning(false),
  });

  const isBluredBackground = useMemo(
    () =>
      type === "FLY_IN_OUT_AND_BLUR_BACKGROUND" ||
      type === "FADE_IN_OUT_AND_BLUR_BACKGROUND" ||
      type === "WITHOUT_AND_BLUR_BACKGROUND",
    [type]
  );

  // - - -

  // Event handler on key down press
  const onKeyDownAction = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInfopoints(viewScreen)(photoIndex);
      }
    },
    [closeInfopoints, photoIndex, viewScreen]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownAction);

    return () => {
      document.removeEventListener("keydown", onKeyDownAction);
    };
  }, [onKeyDownAction]);

  // - - -

  // Act on rewindToTime change, timeline for this slideshow screen
  useEffect(() => {
    if (
      !viewProgress.rewindToTime ||
      !viewScreen.images ||
      viewScreen.images.length === 0 ||
      photosTimesArr.length === 0 ||
      photosTimes.length === 0
    ) {
      return;
    }

    // Initialize
    let timePast = viewProgress.rewindToTime;
    let imageCountPast = 0;
    let actualImageLeftTime = 0;

    while (
      imageCountPast < viewScreen.images.length &&
      timePast >= photosTimes[imageCountPast]
    ) {
      timePast = timePast - photosTimes[imageCountPast];
      imageCountPast = imageCountPast + 1;
    }
    actualImageLeftTime = photosTimes[imageCountPast] - timePast;

    // Create an array for times for all image indices
    const arrPhotoSize = Array(viewScreen.images.length).fill(-1);
    const photoIndexTimesArr = arrPhotoSize.map(
      (actItem: number, arrIndex: number) => {
        if (arrIndex < imageCountPast) {
          return 0;
        }
        if (arrIndex === imageCountPast) {
          return actualImageLeftTime;
        }
        // arrIndex > imageCountPast
        return photosTimes[arrIndex];
      }
    );

    // Update states
    setPhotoIndex(imageCountPast);
    setPhotosTimesArr(photoIndexTimesArr);
    dispatch(setViewProgress({ timeElapsed: viewProgress.rewindToTime }));

    return () => {
      dispatch(setViewProgress({ rewindToTime: null }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewProgress.rewindToTime]);

  // Set store.expo.tooltipInfo.imageUrlFromSlideshow
  useEffect(() => {
    dispatch(setTooltipInfo({ imageUrlsFromSlideshow: images }));
  }, [photoIndex, images, dispatch]);

  // Clear store.expo.tooltipInfo.imageUrlFromSlideshow after clicking to the next screen
  useEffect(() => {
    return () => {
      dispatch(setTooltipInfo({ imageUrlsFromSlideshow: null }));
    };
  }, [dispatch]);

  // - - -

  return (
    <>
      <div
        className="w-full h-full flex items-center justify-center relative"
        ref={containerRef}
      >
        {transition(({ translateX, opacity }, photoIndex) => (
          <animated.div
            className="w-full h-full absolute"
            style={{ translateX, opacity }}
          >
            {isBluredBackground && images[photoIndex] && (
              <img
                className="absolute blur-md w-full h-full object-cover"
                src={images[photoIndex]}
                alt={`blurred background photo number ${photoIndex}`}
              />
            )}

            {images[photoIndex] && (
              <img
                id="photo-image"
                className="absolute w-full h-full object-contain"
                src={images[photoIndex]}
                alt={`photo number ${photoIndex}`}
                onClick={() => closeInfopoints(viewScreen)(photoIndex)}
                onLoad={(e) => setPhotoImgEl(e.currentTarget)}
              />
            )}

            {!isAnimationRunning &&
              viewScreen.images?.[photoIndex]?.infopoints?.map(
                (infopoint, infopointIndex) => {
                  const infopointPosition: Position = {
                    left: infopoint.left,
                    top: infopoint.top,
                  };

                  const imgBoxSize =
                    viewScreen.images?.[photoIndex]?.imageOrigData;

                  const imgNaturalSize = {
                    width: photoImgEl?.naturalWidth ?? 0,
                    height: photoImgEl?.naturalHeight ?? 0,
                  };

                  const imgViewSize = {
                    width: containedImageWidth,
                    height: containedImageHeight,
                  };

                  if (
                    !imgBoxSize ||
                    !imgNaturalSize.width ||
                    !imgNaturalSize.height ||
                    !imgViewSize.width ||
                    !imgViewSize.height
                  ) {
                    return null;
                  }

                  const { left, top } = calculateInfopointPosition(
                    infopointPosition,
                    imgBoxSize,
                    imgNaturalSize,
                    imgViewSize
                  );

                  const adjustedLeft = fromLeftWidth + left;
                  const adjustedTop = fromTopHeight + top;

                  // Render the small 'primary' colored shaking squares or circles
                  // Render one Tooltip for each anchor
                  return (
                    <Fragment
                      key={`infopoint-tooltip-${photoIndex}-${infopointIndex}`}
                    >
                      <AnchorInfopoint
                        id={`infopoint-tooltip-${photoIndex}-${infopointIndex}`}
                        left={adjustedLeft}
                        top={adjustedTop}
                        infopoint={infopoint}
                      />
                      <TooltipInfoPoint
                        key={`infopoint-tooltip-${photoIndex}-${infopointIndex}`}
                        id={`infopoint-tooltip-${photoIndex}-${infopointIndex}`}
                        infopoint={infopoint}
                        infopointStatusMap={infopointStatusMap}
                        setInfopointStatusMap={setInfopointStatusMap}
                        primaryKey={photoIndex.toString()}
                        secondaryKey={infopointIndex.toString()}
                        canBeOpen={!isAnimationRunning}
                      />
                    </Fragment>
                  );
                }
              )}
          </animated.div>
        ))}
      </div>

      {images[photoIndex] && (
        // React Tooltip has z-index by default set to 10
        <GlassMagnifier lensContainerStyle={{ zIndex: 11 }} />
      )}
    </>
  );
};
