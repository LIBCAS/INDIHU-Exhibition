import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { animated, useTransition } from "react-spring";
import { useCountdown } from "hooks/countdown-hook";
import useElementSize from "hooks/element-size-hook";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

import {
  setViewProgress,
  setTooltipInfo,
} from "actions/expoActions/viewer-actions";

import { getScreenTime } from "utils/screen";
import { calculateObjectFit } from "utils/object-fit";
import { resolvePhotogalleryAnimation } from "./view-photogallery-animation";

import { AppState } from "store/store";
import { PhotogaleryScreen } from "models";
import { ScreenProps } from "models";

// - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as PhotogaleryScreen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({ viewScreen, viewProgress })
);

export const ViewPhotogallery = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, viewProgress } = useSelector(stateSelector);
  const dispatch = useDispatch();

  const { images = [] } = screenPreloadedFiles; // from all screenPreloadedFiles just take screenPreloadedFiles.images (all photos as blob:)

  const [photoIndex, setPhotoIndex] = useState(0); // order of the current photo from photogallery
  const [containerRef, containerSize] = useElementSize(); // reference to whole screen container, its { weight, height }

  const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(false); // photos transition animation

  // - - -

  // Orig data - width and height from the administrative, when choosing infopoints locations
  const imageOrigData = useMemo(() => {
    const origData = viewScreen.images?.[photoIndex]?.imageOrigData;
    if (!origData) {
      return { width: 0, height: 0 };
    }
    return origData;
  }, [photoIndex, viewScreen.images]);

  // Previously { width, height, left, top }
  // This width and height should be the width and height of the current 'contained' image
  const { width: imageWidth, height: imageHeight } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: viewScreen.images?.[photoIndex]?.imageOrigData ?? {
          height: 0,
          width: 0,
        },
      }),
    [containerSize, photoIndex, viewScreen.images]
  );

  // How many pixels to skip from the top ('contained' image in the middle vertically)
  const fromTopHeight = (containerSize.height - imageHeight) / 2;
  const fromLeftWidth = (containerSize.width - imageWidth) / 2;

  const time = useMemo(() => getScreenTime(viewScreen), [viewScreen]);

  // - - - -

  const {
    infopointOpenStatusMap,
    setInfopointOpenStatusMap,
    closeInfopoints,
    SquareInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  // - - - -

  const [photosTimesArr, setPhotosTimesArr] = useState<number[]>(() => {
    return Array(images.length).fill(time / images.length);
  });

  // One countdown for each photo in photogallery.. after finished, setIndex to next photo
  const { reset } = useCountdown(photosTimesArr[photoIndex], {
    paused: !viewProgress.shouldIncrement,
    onFinish: () => {
      setPhotoIndex((prev) => (prev + 1) % (viewScreen.images?.length ?? 1));
      reset();
    },
  });

  const type = viewScreen.animationType;
  const animation = useMemo(() => resolvePhotogalleryAnimation(type), [type]);

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

  // Event handler on key down press
  const onKeyDownAction = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInfopoints();
      }
    },
    [closeInfopoints]
  );

  // - - - -

  useEffect(() => {
    window.addEventListener("keydown", onKeyDownAction);

    return () => {
      window.removeEventListener("keydown", onKeyDownAction);
    };
  }, [onKeyDownAction]);

  // Act on rewindToTime change, timeline for this photogallery screen
  useEffect(() => {
    if (!viewScreen.images?.length || !viewProgress.rewindToTime) {
      return;
    }

    // Initialize
    const timeForOnePhoto: number = time / viewScreen.images?.length;
    let imageCountPast = 0;
    let actualImageLeftTime = 0;

    // Calculate the index of current image (according to the rewindedTime) + time left for current image index
    let timePast = viewProgress.rewindToTime;
    while (timePast >= timeForOnePhoto) {
      imageCountPast = imageCountPast + 1;
      timePast = timePast - timeForOnePhoto;
    }
    actualImageLeftTime = timeForOnePhoto - timePast;

    // Create an array for times for all image indeces
    const arrPhotoSize = Array(viewScreen.images.length).fill(-1);
    const photoIndexTimesArr = arrPhotoSize.map(
      (actItem: number, arrIndex: number) => {
        if (arrIndex < imageCountPast) {
          return 0;
        } else if (arrIndex == imageCountPast) {
          return actualImageLeftTime;
        } else {
          return timeForOnePhoto;
        }
      }
    );

    setPhotoIndex(imageCountPast);
    setPhotosTimesArr(photoIndexTimesArr);
    dispatch(setViewProgress({ timeElapsed: viewProgress.rewindToTime }));

    return () => {
      dispatch(setViewProgress({ rewindToTime: null }));
    };
  }, [viewProgress.rewindToTime, dispatch, viewScreen.images?.length, time]);

  // Set store.expo.tooltipInfo.imageUrlFromPhotogallery
  useEffect(() => {
    dispatch(setTooltipInfo({ imageUrlsFromPhotogallery: images }));
  }, [photoIndex, images, dispatch]);

  // Clear store.expo.tooltipInfo.imageUrlFromPhotogallery after clicking to the next screen
  useEffect(() => {
    return () => {
      dispatch(setTooltipInfo({ imageUrlsFromPhotogallery: null }));
    };
  }, [dispatch]);

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
                className="absolute w-full h-full object-contain"
                src={images[photoIndex]}
                alt={`photo number ${photoIndex}`}
                onClick={() => closeInfopoints()}
              />
            )}
            {viewScreen.images?.[photoIndex]?.infopoints?.map(
              (infopoint, infopointIndex) => {
                // Percentage when choosing the infopoints in administrative
                const origTopPercentage =
                  infopoint.top / (imageOrigData.height / 100);
                const origLeftPercentage =
                  infopoint.left / (imageOrigData.width / 100);

                const topPosition =
                  fromTopHeight + (imageHeight / 100) * origTopPercentage;
                const leftPosition =
                  fromLeftWidth + (imageWidth / 100) * origLeftPercentage;

                // Render the small 'primary' colored shaking squares
                return (
                  <SquareInfopoint
                    key={`infopoint-tooltip-${photoIndex}-${infopointIndex}`}
                    id={`infopoint-tooltip-${photoIndex}-${infopointIndex}`}
                    content={infopoint.text ?? "Neuvedeno"}
                    top={topPosition}
                    left={leftPosition}
                  />
                );
              }
            )}
          </animated.div>
        ))}
      </div>

      {/* Render one Tooltip as infopoint component for each previously rendered square, 1: 1 */}
      {/* Infopoint Tooltip which is alwaysVisible has different behaviour than infopoint which is not!*/}
      {viewScreen.images?.[photoIndex]?.infopoints?.map(
        (infopoint, infopointIndex) => {
          return (
            <TooltipInfoPoint
              key={`infopoint-tooltip-${photoIndex}-${infopointIndex}`}
              id={`infopoint-tooltip-${photoIndex}-${infopointIndex}`}
              isAlwaysVisible={infopoint.alwaysVisible}
              infopointOpenStatusMap={infopointOpenStatusMap}
              setInfopointOpenStatusMap={setInfopointOpenStatusMap}
              primaryKey={photoIndex.toString()}
              secondaryKey={infopointIndex.toString()}
              canBeOpen={!isAnimationRunning}
            />
          );
        }
      )}
    </>
  );
};
