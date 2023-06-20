import { useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import { animated, useSpring } from "react-spring";

import { setViewProgress } from "actions/expoActions/viewer-actions";
import { clamp } from "lodash";
import cx from "classnames";

import { Tooltip } from "react-tooltip";

import { AppState } from "store/store";
import { tickTime } from "constants/view-screen-progress";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.tooltipInfo,
  (viewProgress, viewScreen, tooltipInfo) => ({
    viewProgress,
    viewScreen,
    tooltipInfo,
  })
);

type Props = {
  height?: number;
  color?: "white" | "primary" | "secondary";
  percentage: number;
};

export const ProgressBar = ({
  height = 10,
  color = "primary",
  percentage,
}: Props) => {
  const { viewProgress, viewScreen, tooltipInfo } = useSelector(stateSelector);
  const dispatch = useDispatch();

  // progBarRect on info side panel is useRef.. on actualization when opened does not cause rerender, breaks the functioanlity of progress bar
  const [rerender, setRerender] = useState<boolean>(false);

  const [percentageOnMouseMove, setPercentageOnMouseMove] = useState<
    number | null
  >(null);

  const wholeProgBarRef = useRef<HTMLDivElement>(null);

  const progBarRect: DOMRect | undefined =
    wholeProgBarRef.current?.getBoundingClientRect();

  // 1.)
  const onProgressBarClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!progBarRect) {
      return;
    }
    if (!viewScreen) {
      return;
    }

    if (viewScreen.type !== "VIDEO" && viewScreen.type !== "PHOTOGALERY") {
      return;
    }

    const percent = ((e.clientX - progBarRect.left) / progBarRect.width) * 100;

    if (percent > 100 || percent < 0) {
      setRerender(!rerender);
    }

    const timeElapsedPercent = (viewProgress.totalTime / 100) * percent;
    const timeElapsedRounded =
      timeElapsedPercent - (timeElapsedPercent % tickTime);

    dispatch(setViewProgress({ rewindToTime: timeElapsedRounded }));
  };

  // 2.)
  const onMouseMoveHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!progBarRect) {
      return;
    }
    const percent = ((e.clientX - progBarRect.left) / progBarRect.width) * 100;
    if (percent > 100 || percent < 0) {
      setRerender(!rerender);
    }
    setPercentageOnMouseMove(percent);
  };

  // 3.)
  const onMouseLeaveHandler = () => {
    setPercentageOnMouseMove(null);
  };

  const clampedPercentage = useMemo(
    () => clamp(percentage, 0, 100),
    [percentage]
  );

  const style = useSpring({
    width: `${clampedPercentage}%`,
    config: { duration: 500 },
  });

  return (
    <div
      ref={wholeProgBarRef}
      style={{ minHeight: height }}
      className="w-full bg-muted-200 hover:cursor-pointer"
      onClick={onProgressBarClick}
      onMouseMove={onMouseMoveHandler}
      onMouseLeave={onMouseLeaveHandler}
      data-tooltip-content="0:00"
      data-tooltip-id="progress-bar-tooltip"
    >
      <animated.div
        style={{ ...style, minHeight: height }}
        className={cx(
          "h-full",
          color === "primary" && "bg-primary",
          color === "white" && "bg-white",
          color === "secondary" && "bg-primary"
        )}
      />

      {viewScreen?.type === "VIDEO" && (
        <Tooltip
          id="progress-bar-tooltip"
          float
          variant="light"
          render={() => {
            if (!tooltipInfo.videoDuration) {
              return <></>;
            }
            if (!percentageOnMouseMove) {
              return <></>;
            }
            const durationValueSeconds =
              (tooltipInfo.videoDuration / 100) * percentageOnMouseMove;
            const durationValueSecondsRounded: number = parseFloat(
              durationValueSeconds.toFixed(2)
            );

            const mzminutes = Math.floor(durationValueSecondsRounded / 60);
            const mzseconds = Math.floor(
              durationValueSecondsRounded - mzminutes * 60
            );
            return (
              <div>
                {mzminutes}:{mzseconds}
              </div>
            );
          }}
        />
      )}

      {viewScreen?.type === "PHOTOGALERY" && (
        <Tooltip
          id="progress-bar-tooltip"
          float
          variant="light"
          render={() => {
            if (
              !percentageOnMouseMove ||
              !tooltipInfo.imageUrlsFromPhotogallery
            ) {
              return <></>;
            }
            const images = tooltipInfo.imageUrlsFromPhotogallery;
            const onePart = 100 / images.length;

            const currentImageIndex = Math.floor(
              percentageOnMouseMove / onePart
            );

            return (
              <img
                className="w-44 h-24 object-cover"
                src={images[currentImageIndex]}
                alt="Nahled obrazku zo slideshow"
              />
            );
          }}
        />
      )}
    </div>
  );
};
