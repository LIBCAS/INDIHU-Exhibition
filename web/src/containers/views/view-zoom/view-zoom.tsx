import { useMemo, CSSProperties } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, useTransition } from "react-spring";

// Custom hook
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import useResizeObserver from "hooks/use-resize-observer";
import { useZoom } from "./useZoom";

// Models
import { AppState } from "store/store";
import { ScreenProps, ZoomScreen, Size, ZoomType } from "models";

// Utils
import cx from "classnames";

import { calculateObjectFit } from "utils/object-fit";
import { ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME } from "constants/screen";
import { generateFakeSequence } from "./zoom-utils";

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

  const { bgTheming, fgTheming, isLightMode } = useExpoDesignData();

  // - - - Derived variables (settings) - - -

  const zoomType = useMemo<ZoomType>(
    () => viewScreen.zoomType ?? "RESET_AFTER_ZOOM",
    [viewScreen.zoomType]
  );

  const imageOrigData = useMemo<Size>(
    () => viewScreen.imageOrigData ?? { width: 0, height: 0 },
    [viewScreen.imageOrigData]
  );

  const delayTime = useMemo(
    () =>
      (viewScreen.seqDelayTime ?? ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME) * 1000,
    [viewScreen.seqDelayTime]
  );

  const sequences = useMemo(() => {
    const baseSequences = viewScreen.sequences ?? [];
    if (zoomType === "RESET_AFTER_ZOOM") {
      return baseSequences;
    }

    const fakeSequence = generateFakeSequence(imageOrigData, delayTime);
    const extendedSequences = [...baseSequences, fakeSequence];
    return extendedSequences;
  }, [viewScreen.sequences, zoomType, imageOrigData, delayTime]);

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

  const { currSequence, isDelayActive, zoomStyle } = useZoom(
    sequences,
    shouldIncrement,
    delayTime,
    { containedImgWidth, containedImgHeight },
    { widthRatio, heightRatio },
    zoomType
  );

  // - - - Animation (tooltip box) - - -

  const shouldShowSeqTooltip = useMemo(
    () => currSequence !== null && isDelayActive === false,
    [currSequence, isDelayActive]
  );

  const infoTransition = useTransition(
    shouldShowSeqTooltip ? currSequence : null,
    {
      from: { opacity: 0, translateX: isTooltipPositionRight ? 15 : -15 },
      enter: { opacity: 1, translateX: 0, delay: 250 },
      leave: { opacity: 0, translateX: isTooltipPositionRight ? 15 : -15 },
    }
  );

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
          style={zoomStyle}
        />
      )}

      {infoTransition(
        ({ opacity, translateX }, currSequence) =>
          currSequence &&
          currSequence.text && (
            <animated.div
              className={cx(
                "fixed p-4 max-w-[320px] rounded-none shadow-md shadow-neutral-600",
                {
                  "border-solid border-[1px] border-black": isLightMode,
                  "border-solid border-[1px] border-white": !isLightMode,
                  ...bgTheming,
                  ...fgTheming,
                }
              )}
              style={{
                opacity,
                translateX,
                ...tooltipStyle,
                // Override global theming settings if local sequence has these colors set
                backgroundColor: currSequence.bgColor ?? undefined,
                color: currSequence.textColor ?? undefined,
                borderColor: currSequence.borderColor ?? undefined,
              }}
            >
              {currSequence.text}
            </animated.div>
          )
      )}
    </div>
  );
};
