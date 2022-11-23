import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import Tooltip from "react-tooltip";

import { AppState } from "store/store";
import { ImageScreen } from "models";

import { ScreenProps } from "../types";

import { getScreenTime } from "utils/screen";
import { useSpring, animated } from "react-spring";
import { getViewImageAnimation } from "./view-image-animation";
import useElementSize from "hooks/element-size-hook";
import { calculateObjectFit } from "utils/object-fit";
import { Infopoint } from "components/infopoint/infopoint";
import { useInfopointTooltip } from "components/infopoint/infopoint-tooltip-hook";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ImageScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewScreen, shouldIncrement) => ({ viewScreen, shouldIncrement })
);

export const ViewImage = ({ screenFiles }: ScreenProps) => {
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wrapperRef, parentSize] = useElementSize();
  const { image } = screenFiles;

  const { renderTooltip, showTooltip } = useInfopointTooltip();
  const duration = useMemo(
    () => getScreenTime(viewScreen, { unit: "ms" }),
    [viewScreen]
  );

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

  return (
    <>
      <div ref={wrapperRef} className="h-full w-full overflow-hidden">
        <animated.div
          className="h-full w-full flex items-center justify-center relative"
          style={{ translateX, translateY }}
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
                className="absolue top-0 left-0 h-full w-full object-contain"
                src={image}
              />
            )}
            {viewScreen.infopoints?.map((infopoint, index) => (
              <Infopoint
                key={index}
                data-tip={infopoint.text}
                data-for="view-image-infopoint-tooltip"
                data-event="click focus"
                className="absolute z-10"
                style={{
                  top: top + infopoint.top * ratio,
                  left: left + infopoint.left * ratio,
                  // we need to scale the infopoint back down to normal size
                  transform: `translate(-50%, -50%) scale(${1 / scale.get()})`,
                }}
              />
            ))}
          </animated.div>

          {showTooltip && (
            <Tooltip
              clickable
              getContent={renderTooltip}
              globalEventOff="click"
              effect="solid"
              type="light"
              id="view-image-infopoint-tooltip"
              className="bg-white shadow-md text-black"
            />
          )}
        </animated.div>
      </div>
    </>
  );
};
