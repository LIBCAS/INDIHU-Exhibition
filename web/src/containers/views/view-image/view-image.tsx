import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";
import useElementSize from "hooks/element-size-hook";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";
import { useGlassMagnifier } from "hooks/view-hooks/glass-magnifier-hook/useGlassMagnifier";

import { getViewImageAnimation } from "./view-image-animation";
import { calculateObjectFit } from "utils/object-fit";
import { getScreenTime } from "utils/screen";

import { AppState } from "store/store";
import { ImageScreen } from "models";
import { ScreenProps } from "models";
import { calculateInfopointPosition } from "utils/infopoint-utils";

// - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ImageScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewScreen, shouldIncrement) => ({ viewScreen, shouldIncrement })
);

export const ViewImage = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);
  const { image } = screenPreloadedFiles;

  /* Wrapper is the whole <div> of this screen */
  /* Container is <div> without tooltip */
  const [wrapperRef, parentSize] = useElementSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containedImgEl, setContainedImgEl] = useState<HTMLImageElement | null>(
    null
  );

  const { GlassMagnifier } = useGlassMagnifier(
    containerRef.current,
    containedImgEl
  );

  // - - - -

  const {
    width: containedImageWidth,
    height: containedImageHeight,
    left: fromLeft,
    top: fromTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        type: "contain",
        parent: parentSize,
        child: viewScreen?.imageOrigData ?? { height: 0, width: 0 },
      }),
    [parentSize, viewScreen.imageOrigData]
  );

  // const ratio = useMemo(
  //   () => containedImageHeight / (viewScreen.imageOrigData?.height ?? 1),
  //   [containedImageHeight, viewScreen.imageOrigData?.height]
  // );

  // - - - -

  /* Duration of the screen */
  const duration = useMemo(
    () => getScreenTime(viewScreen, { unit: "ms" }),
    [viewScreen]
  );

  /* From viewScreen.animationType of the Image */
  const animation = useMemo(
    () => getViewImageAnimation(viewScreen.animationType),
    [viewScreen.animationType]
  );

  const { scale, translateX, translateY } = useSpring({
    ...animation,
    config: {
      duration,
    },
    pause: !shouldIncrement,
  });

  // - - - -

  const {
    infopointOpenStatusMap,
    setInfopointOpenStatusMap,
    closeInfopoints,
    ScreenAnchorInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  // Event handler on key down press
  const onKeyDownAction = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInfopoints(viewScreen)();
      }
    },
    [closeInfopoints, viewScreen]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownAction);

    return () => {
      document.removeEventListener("keydown", onKeyDownAction);
    };
  }, [onKeyDownAction]);

  // - - - -

  return (
    <div ref={wrapperRef} className="h-full w-full overflow-hidden">
      <animated.div
        className="h-full w-full flex items-center justify-center relative"
        style={{ translateX: translateX, translateY: translateY }}
      >
        <animated.div
          ref={containerRef}
          className="h-full w-full"
          style={{ scale }}
        >
          {viewScreen.animationType === "WITHOUT_AND_BLUR_BACKGROUND" &&
            image && (
              <img
                className="absolute top-0 left-0 h-full w-full object-cover blur-md"
                src={image}
              />
            )}

          {image && (
            <img
              className="absolute top-0 left-0 h-full w-full object-contain"
              onLoad={(e) => setContainedImgEl(e.currentTarget)}
              src={image}
              onClick={() => closeInfopoints(viewScreen)()}
            />
          )}

          {viewScreen.infopoints?.map((infopoint, infopointIndex) => {
            const infopointPosition = {
              left: infopoint.left,
              top: infopoint.top,
            };
            const imgBoxSize = viewScreen.imageOrigData;
            const imgNaturalSize = {
              width: containedImgEl?.naturalWidth ?? 0,
              height: containedImgEl?.naturalHeight ?? 0,
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

            const adjustedLeft = fromLeft + left;
            const adjustedTop = fromTop + top;

            return (
              <React.Fragment key={`infopoint-tooltip-${infopointIndex}`}>
                <ScreenAnchorInfopoint
                  id={`infopoint-tooltip-${infopointIndex}`}
                  left={adjustedLeft}
                  top={adjustedTop}
                  infopoint={infopoint}
                  // we need to scale the infopoint back down to normal size
                  style={{
                    transform: `translate(-50%, -50%) scale(${
                      1 / scale.get()
                    })`,
                  }}
                />
                <TooltipInfoPoint
                  key={`infopoint-tooltip-${infopointIndex}`}
                  id={`infopoint-tooltip-${infopointIndex}`}
                  infopoint={infopoint}
                  infopointOpenStatusMap={infopointOpenStatusMap}
                  setInfopointOpenStatusMap={setInfopointOpenStatusMap}
                  primaryKey={infopointIndex.toString()}
                />
              </React.Fragment>
            );
          })}

          {image && <GlassMagnifier lensContainerStyle={{ zIndex: 11 }} />}
        </animated.div>
      </animated.div>
    </div>
  );
};
