import { useMemo, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";
import useElementSize from "hooks/element-size-hook";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

import { getViewImageAnimation } from "./view-image-animation";
import { calculateObjectFit } from "utils/object-fit";
import { getScreenTime } from "utils/screen";

import { AppState } from "store/store";
import { ImageScreen } from "models";
import { ScreenProps } from "models";

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

  // - - - -

  //const imageOrigData = viewScreen.imageOrigData ?? { width: 0, height: 0 };

  const { height, top, left } = useMemo(
    () =>
      calculateObjectFit({
        type: "contain",
        parent: parentSize,
        child: viewScreen?.imageOrigData ?? { height: 0, width: 0 },
      }),
    [parentSize, viewScreen.imageOrigData]
  );

  const ratio = useMemo(
    () => height / (viewScreen.imageOrigData?.height ?? 1),
    [height, viewScreen.imageOrigData?.height]
  );

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
    SquareInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  // Event handler on key down press
  const onKeyDownAction = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInfopoints();
      }
    },
    [closeInfopoints]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDownAction);

    return () => {
      window.removeEventListener("keydown", onKeyDownAction);
    };
  }, [onKeyDownAction]);

  // - - - -

  return (
    <>
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
                src={image}
                onClick={() => closeInfopoints()}
              />
            )}
            {viewScreen.infopoints?.map((infopoint, infopointIndex) => (
              <SquareInfopoint
                key={`infopoint-tooltip-${infopointIndex}`}
                id={`infopoint-tooltip-${infopointIndex}`}
                content={infopoint.text ?? "Neuvedeno"}
                top={top + infopoint.top * ratio}
                left={left + infopoint.left * ratio}
                // we need to scale the infopoint back down to normal size
                style={{
                  transform: `translate(-50%, -50%) scale(${1 / scale.get()})`,
                }}
              />
            ))}
          </animated.div>

          {/* Render one Tooltip as infopoint component for each previously rendered square, 1: 1 */}
          {/* Infopoint Tooltip which is alwaysVisible has different behaviour than infopoint which is not!*/}
          {viewScreen.infopoints?.map((infopoint, infopointIndex) => {
            return (
              <TooltipInfoPoint
                key={`infopoint-tooltip-${infopointIndex}`}
                id={`infopoint-tooltip-${infopointIndex}`}
                isAlwaysVisible={infopoint.alwaysVisible}
                infopointOpenStatusMap={infopointOpenStatusMap}
                setInfopointOpenStatusMap={setInfopointOpenStatusMap}
                primaryKey={infopointIndex.toString()}
              />
            );
          })}
        </animated.div>
      </div>
    </>
  );
};
