import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { animated, easings, useSpring } from "react-spring";
import useResizeObserver from "hooks/use-resize-observer";

// Models
import { ScreenProps, ParallaxScreeen } from "models";
import { AppState } from "store/store";

// Utils
import { getScreenTime } from "utils/screen";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ParallaxScreeen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({ viewScreen, viewProgress })
);

// - -

export const ViewParallax = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, viewProgress } = useSelector(stateSelector);
  const { images } = viewScreen;

  const preloadedImages = screenPreloadedFiles.images;
  const preloadedRootImg = preloadedImages?.[0];

  const duration = useMemo(
    () => getScreenTime(viewScreen, { unit: "ms" }),
    [viewScreen]
  );

  // Animation stuff
  const animationType = viewScreen.animationType;

  const isAnimationHorizontal = useMemo(
    () =>
      animationType === "FROM_LEFT_TO_RIGHT" ||
      animationType === "FROM_RIGHT_TO_LEFT",
    [animationType]
  );

  const animationScale = useMemo(
    () =>
      animationType === "FROM_BOTTOM" || animationType === "FROM_RIGHT_TO_LEFT"
        ? -1
        : 1,
    [animationType]
  );

  //
  const [
    viewContainerRef,
    { width: viewContainerWidth, height: viewContainerHeight },
  ] = useResizeObserver();

  const totalDistance = useMemo(
    () =>
      (isAnimationHorizontal ? viewContainerWidth : viewContainerHeight) / 8,
    [isAnimationHorizontal, viewContainerWidth, viewContainerHeight]
  );

  //
  const { offset } = useSpring({
    from: {
      offset: -1,
    },
    to: {
      offset: 1,
    },
    config: { duration, easing: easings.easeInOutSine },
    pause: !viewProgress.shouldIncrement,
  });

  return (
    <div
      ref={viewContainerRef}
      className="h-full w-full flex justify-center items-center relative overflow-hidden"
    >
      {preloadedRootImg && (
        <img src={preloadedRootImg} className="w-full h-full object-contain" />
      )}

      {images?.map((imgId, imgIndex) => {
        if (imgIndex === 0) {
          return null;
        }

        // Interpolation of offset value to value that is used directly in style prop
        const translateOffset = offset.to(
          (value) =>
            ((value * totalDistance) / images?.length ?? 1) *
            (imgIndex + 1) *
            animationScale
        );

        return (
          <animated.img
            key={imgId}
            className="absolute w-full h-full object-contain"
            src={preloadedImages?.[imgIndex]}
            style={{
              translateY: isAnimationHorizontal ? undefined : translateOffset,
              translateX: isAnimationHorizontal ? translateOffset : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
