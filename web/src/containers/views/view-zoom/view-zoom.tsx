import { useState, useEffect, useMemo, CSSProperties } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, useSpring, useTransition, easings } from "react-spring";

// Custom hook
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import useResizeObserver from "hooks/use-resize-observer";
import { useZoomPhase } from "./useZoomPhase";

// Models
import { AppState } from "store/store";
import { ScreenProps, ZoomScreen, Sequence, Size } from "models";

// Utils
import cx from "classnames";
import { calculateSequenceParameters } from "./useZoomPhase";
import { calculateObjectFit } from "utils/object-fit";
import { ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME } from "constants/screen";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ZoomScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewScreen, shouldIncrement) => ({ viewScreen, shouldIncrement })
);

// - - - - - -

export const ViewZoom = ({ screenPreloadedFiles }: ScreenProps) => {
  const { image } = screenPreloadedFiles;
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);

  const { bgTheming, fgTheming } = useExpoDesignData();

  // - - - Derived variables (settings) - - -

  const sequences = useMemo(() => viewScreen.sequences, [viewScreen.sequences]);

  const delayTime = useMemo(
    () =>
      (viewScreen.seqDelayTime ?? ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME) * 1000,
    [viewScreen.seqDelayTime]
  );

  const isTooltipPositionRight = useMemo(
    () => (viewScreen.tooltipPosition === "TOP_RIGHT" ? true : false),
    [viewScreen.tooltipPosition]
  );

  const tooltipStyle = useMemo<CSSProperties>(() => {
    if (isTooltipPositionRight) {
      return { top: 20, right: 20 };
    }
    return { top: 20, left: 20 };
  }, [isTooltipPositionRight]);

  const imageOrigData = useMemo<Size>(
    () => viewScreen.imageOrigData ?? { width: 0, height: 0 },
    [viewScreen.imageOrigData]
  );

  // - - - Contained image - - -

  const [containerRef, containerSize] = useResizeObserver();

  const { width: containedImgWidth, height: containedImgHeight } = useMemo(
    () =>
      calculateObjectFit({
        type: "contain",
        parent: containerSize,
        child: imageOrigData,
      }),
    [containerSize, imageOrigData]
  );

  const [widthRatio, heightRatio] = useMemo(
    () => [
      containedImgWidth / (imageOrigData.width || 1),
      containedImgHeight / (imageOrigData.height || 1),
    ],
    [
      containedImgWidth,
      imageOrigData.width,
      imageOrigData.height,
      containedImgHeight,
    ]
  );

  // - - - Zooming functionality - - -

  const [currSequence, setCurrSequence] = useState<Sequence | null>(null);

  const { zoomingIn, stayingIn } = useZoomPhase(currSequence) ?? {};

  // - - - Spring - - -

  const [{ zoom, translate }, api] = useSpring(() => ({
    zoom: 1,
    translate: 1,
  }));

  // - - - Effects - - -

  /**
   * Effect responsible for playing / pausing the sequence animation flow
   */
  useEffect(() => {
    if (!shouldIncrement) {
      api.pause();
      return;
    }
    api.resume();
  }, [api, shouldIncrement]);

  /**
   * Effect responsible for starting and handling the sequence animation flow
   */
  useEffect(() => {
    sequences?.reduce((accDelay, seq) => {
      const { duration } = calculateSequenceParameters(seq);

      api.start({
        from: { zoom: 0, translate: 0 },
        to: { zoom: 1, translate: 1 },
        delay: accDelay,
        config: { duration: duration }, // easing: easings.easeInOutQuad
        onStart: () => setCurrSequence(seq),
        onResolve: () => setCurrSequence(null),
      });

      return accDelay + duration + delayTime;
    }, delayTime);
  }, [sequences, api, delayTime]);

  // - - - Animation - - -

  const infoTransition = useTransition(currSequence, {
    from: { opacity: 0, translateX: isTooltipPositionRight ? 15 : -15 },
    enter: { opacity: 1, translateX: 0, delay: 250 },
    leave: { opacity: 0, translateX: isTooltipPositionRight ? 15 : -15 },
  });

  // - - - GUI - - -

  return (
    <div
      className="w-full h-full flex justify-center items-center overflow-hidden"
      ref={containerRef}
    >
      {image && (
        <animated.img
          className="w-full h-full object-contain"
          src={image}
          style={
            currSequence && zoomingIn && stayingIn
              ? {
                  scale: zoom
                    .to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 0]) // NOTE: [zooming-in, staying-in-detail, zooming-out] for scale looks like [0, 1, 1, 0]
                    .to((x) => Math.log2(x + 1)) // NOTE: represents easing function, our custom one, not using predefined
                    .to([0, 1], [1, currSequence.zoom]), // NOTE: When zooming-in, we need to map value 1 to our real zoom scale value
                  translateX: translate
                    .to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 0])
                    .to(easings.easeOutQuad)
                    .to(
                      [0, 1],
                      [
                        0,
                        containedImgWidth / 2 - currSequence.left * widthRatio,
                      ]
                    ),
                  translateY: translate
                    .to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 0])
                    .to(easings.easeOutQuad)
                    .to(
                      [0, 1],
                      [
                        0,
                        containedImgHeight / 2 - currSequence.top * heightRatio,
                      ]
                    ),
                }
              : undefined
          }
        />
      )}

      {infoTransition(
        ({ opacity, translateX }, currSequence) =>
          currSequence && (
            <animated.div
              className={cx(
                "fixed p-4 shadow-md text-black bg-white max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] overflow-x-hidden text-ellipsis",
                {
                  ...bgTheming,
                  ...fgTheming,
                }
              )}
              style={{ opacity, translateX, ...tooltipStyle }}
            >
              {currSequence.text}
            </animated.div>
          )
      )}
    </div>
  );
};
