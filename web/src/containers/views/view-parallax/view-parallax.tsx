import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, easings, useSpring } from "react-spring";

// Hooks
import useResizeObserver from "hooks/use-resize-observer";

// Models
import { AppState } from "store/store";
import { ScreenProps, ParallaxScreeen } from "models";
import { ScreenParallaxAnimationEnum } from "enums/administration-screens";

// Utils
import { getScreenTime } from "utils/screen";
import { calculateParallaxOffsetOld } from "./parallax-utils";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ParallaxScreeen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({ viewScreen, viewProgress })
);

// - - - - - -

export const ViewParallax = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, viewProgress } = useSelector(stateSelector);
  const preloadedImages = screenPreloadedFiles.images ?? [];

  // - - - Screen administration - - -

  const screenDuration = useMemo(
    () => getScreenTime(viewScreen, { unit: "ms" }),
    [viewScreen]
  );

  const animationType = useMemo(
    () => viewScreen.animationType ?? ScreenParallaxAnimationEnum.WITHOUT,
    [viewScreen.animationType]
  );

  // - - - Hooks - - -

  const [viewContainerRef, viewContainerSize] = useResizeObserver();

  // - - - Animation stuff - - -

  const isAnimationHorizontal = useMemo(
    () =>
      animationType === "FROM_LEFT_TO_RIGHT" ||
      animationType === "FROM_RIGHT_TO_LEFT",
    [animationType]
  );

  const isAnimationVertical = useMemo(
    () => animationType === "FROM_TOP" || animationType === "FROM_BOTTOM",
    [animationType]
  );

  /**
   *
   */
  const animationScale = useMemo(() => {
    if (
      animationType === "FROM_BOTTOM" ||
      animationType === "FROM_RIGHT_TO_LEFT"
    ) {
      return -1;
    }

    if (
      animationType === "FROM_TOP" ||
      animationType === "FROM_LEFT_TO_RIGHT"
    ) {
      return 1;
    }

    return 0;
  }, [animationType]);

  /**
   *
   */
  const totalDistance = useMemo(() => {
    const distance = isAnimationHorizontal
      ? viewContainerSize.width
      : isAnimationVertical
      ? viewContainerSize.height
      : 0;

    return distance / 8;
  }, [
    isAnimationHorizontal,
    isAnimationVertical,
    viewContainerSize.width,
    viewContainerSize.height,
  ]);

  /**
   *
   */
  const { offset } = useSpring({
    from: { offset: -1 },
    to: { offset: 1 },
    config: { duration: screenDuration, easing: easings.easeInOutSine },
    pause: !viewProgress.shouldIncrement,
  });

  // - - - GUI - - -

  return (
    <div
      ref={viewContainerRef}
      className="relative w-full h-full flex justify-center items-center overflow-hidden"
    >
      {preloadedImages.map((preloadedImgSrc, preloadedImgIdx) => {
        if (preloadedImgSrc === undefined || preloadedImgSrc === null) {
          const errMsg = `Detected nullable preloaded img source for parallax at index: ${preloadedImgIdx}`;
          console.error(errMsg);
          return <></>;
        }

        // NOTE: First preloaded img is the background image which should not move at all
        if (preloadedImgIdx === 0) {
          return (
            <img
              key={preloadedImgIdx}
              src={preloadedImgSrc}
              className="w-full h-full object-contain"
            />
          );
        }

        // NOTE1: Interpolation of offset value to value that is used directly in style prop
        // NOTE2: Two algorithms are currently available:
        //     - `calculateParallaxOffsetOld()` OR `calculateParallaxOffset()`
        const totalImages = preloadedImages.length;
        const translateOffset = calculateParallaxOffsetOld(
          offset,
          preloadedImgIdx,
          totalImages,
          totalDistance,
          animationScale
        );

        return (
          <animated.img
            key={preloadedImgIdx}
            src={preloadedImgSrc}
            className="absolute w-full h-full object-contain"
            style={{
              translateX: isAnimationHorizontal ? translateOffset : undefined,
              translateY: isAnimationVertical ? translateOffset : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
