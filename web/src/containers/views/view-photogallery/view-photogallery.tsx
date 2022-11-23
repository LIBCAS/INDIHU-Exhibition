import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { animated, useTransition } from "react-spring";
import { createSelector } from "reselect";
import Tooltip from "react-tooltip";

import { PhotogaleryScreen } from "models";
import { AppState } from "store/store";
import { getScreenTime } from "utils/screen";
import { useCountdown } from "hooks/countdown-hook";
import { Infopoint } from "components/infopoint/infopoint";
import { calculateObjectFit } from "utils/object-fit";
import useElementSize from "hooks/element-size-hook";
import { useInfopointTooltip } from "components/infopoint/infopoint-tooltip-hook";

import { ScreenProps } from "../types";
import { resolvePhotogalleryAnimation } from "./view-photogallery-animation";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as PhotogaleryScreen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({ viewScreen, viewProgress })
);

export const ViewPhotogallery = ({ screenFiles }: ScreenProps) => {
  const { viewScreen, viewProgress } = useSelector(stateSelector);
  const [index, setIndex] = useState(0);
  const [ref, containerSize] = useElementSize();
  const { images = [] } = screenFiles;

  const { renderTooltip, showTooltip } = useInfopointTooltip();

  const time = useMemo(() => getScreenTime(viewScreen), [viewScreen]);

  const { reset } = useCountdown(time / (viewScreen.images?.length ?? 1), {
    paused: !viewProgress.shouldIncrement,
    onFinish: () => {
      setIndex((prev) => (prev + 1) % (viewScreen.images?.length ?? 1));
      Tooltip.hide();
      reset();
    },
  });

  const type = viewScreen.animationType;
  const animation = useMemo(() => resolvePhotogalleryAnimation(type), [type]);

  const transitionProps = useMemo(
    () => ({ ...animation, paused: !viewProgress.shouldIncrement }),
    [animation, viewProgress.shouldIncrement]
  );

  const transition = useTransition(index, transitionProps);

  const { top, left } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: viewScreen.images?.[index]?.imageOrigData ?? {
          height: 0,
          width: 0,
        },
      }),
    [containerSize, index, viewScreen.images]
  );

  useEffect(() => {
    Tooltip.rebuild();
  }, [index]);

  const bluredBackground = useMemo(
    () =>
      type === "FLY_IN_OUT_AND_BLUR_BACKGROUND" ||
      type === "FADE_IN_OUT_AND_BLUR_BACKGROUND" ||
      type === "WITHOUT_AND_BLUR_BACKGROUND",
    [type]
  );

  return (
    <>
      <div
        className="w-full h-full flex items-center justify-center relative"
        ref={ref}
      >
        {transition(({ translateX, opacity }, index) => (
          <animated.div
            className="w-full h-full absolute"
            style={{ translateX, opacity }}
          >
            {bluredBackground && images[index] && (
              <img
                className="absolute blur-md w-full h-full object-cover"
                src={images[index]}
                alt={`blurred background photo number ${index}`}
              />
            )}
            {images[index] && (
              <img
                className="absolute w-full h-full object-contain"
                src={images[index]}
                alt={`photo number ${index}`}
              />
            )}
            {viewScreen.images?.[index]?.infopoints?.map(
              (infopoint, infopointIndex) => (
                <Infopoint
                  key={infopointIndex}
                  data-tip={infopoint.text}
                  data-for="view-photogallery-infopoint-tooltip"
                  data-event="click focus"
                  className="absolute"
                  style={{
                    top: top + infopoint.top,
                    left: left + infopoint.left,
                  }}
                />
              )
            )}
          </animated.div>
        ))}
      </div>

      {showTooltip && (
        <Tooltip
          clickable
          getContent={renderTooltip}
          globalEventOff="click"
          effect="solid"
          type="light"
          id="view-photogallery-infopoint-tooltip"
          className="!pointer-events-auto !opacity-100 !rounded-none shadow-md"
        />
      )}
    </>
  );
};
