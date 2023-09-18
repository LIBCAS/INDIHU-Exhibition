import { useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import { animated, useSpring } from "react-spring";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { setViewProgress } from "actions/expoActions/viewer-actions";
import { clamp } from "lodash";

import { Tooltip } from "react-tooltip";

import { AppState } from "store/store";
import { tickTime } from "constants/view-screen-progress";

import { getCumulativeSum, getScreenPhotoIndex } from "utils/screen";
import { screenType } from "enums/screen-type";

// - - - - - - - -

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
  percentage: number;
  height?: number;
  color?: "white" | "primary";
};

// - - - - - - - -

export const ProgressBar = ({ height = 10, color, percentage }: Props) => {
  const { viewProgress, viewScreen, tooltipInfo } = useSelector(stateSelector);
  const dispatch = useDispatch();

  const { expoDesignData, palette } = useExpoDesignData();

  const progressBarColor = useMemo(() => {
    if (color) {
      return color;
    }
    const iconsColor = expoDesignData?.iconsColor;
    if (!iconsColor) {
      return palette.primary;
    }
    return iconsColor;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expoDesignData?.iconsColor]);

  // Ref to the progressbar container and rectangle information about this container!
  const wholeProgBarRef = useRef<HTMLDivElement>(null);
  const progBarRect: DOMRect | undefined =
    wholeProgBarRef.current?.getBoundingClientRect();

  // progBarRect on info side panel is useRef.. on actualization when opened does not cause rerender, breaks the functioanlity of progress bar
  const [rerender, setRerender] = useState<boolean>(false);

  // State which captures on every mouse move, how far in % the mouse is from the left begining of the progressbar
  const [percentageOnMouseMove, setPercentageOnMouseMove] = useState<
    number | null
  >(null);

  // - - - - -

  // Required only for SLIDESHOW type of viewScreen
  const photosPercentages = useMemo(() => {
    if (
      !viewScreen ||
      viewScreen.type !== screenType.SLIDESHOW ||
      !viewScreen.images ||
      viewScreen.images.length === 0 ||
      !viewScreen.time
    ) {
      return null;
    }

    if (!viewScreen.timePhotosManual) {
      const evenlyDividedTimes = Array(viewScreen.images.length).fill(
        100 / viewScreen.images.length
      ) as number[];

      const cumulativePercentages = getCumulativeSum(evenlyDividedTimes);
      return cumulativePercentages;
    }

    // timePhotosManual
    const photosTimes = viewScreen.images.reduce<number[]>(
      (acc, currItem) => [...acc, currItem.time ? currItem.time * 1000 : 5000],
      []
    );

    const totalTime = photosTimes.reduce((acc, currItem) => acc + currItem, 0);

    const cumulative = getCumulativeSum(photosTimes);

    const photosPercentages = cumulative.map(
      (currItem) => (currItem / totalTime) * 100
    );

    return photosPercentages;
  }, [viewScreen]);

  // 1. Handler called when clicked on the progressbar, but only on SLIDESHOW and VIDEO screens
  const onProgressBarClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!viewScreen || !progBarRect) {
      return;
    }

    if (
      viewScreen.type !== "VIDEO" &&
      viewScreen.type !== screenType.SLIDESHOW
    ) {
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

  // 2. Handler called everytime the mouse was moved over the progressbar (in order to display tooltips)
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

  // 3. Handler called when the mouse leaved the progressbar (in order to not display tooltips anymore)
  const onMouseLeaveHandler = () => {
    setPercentageOnMouseMove(null);
  };

  //
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
      className="w-full bg-medium-gray hover:cursor-pointer"
      onClick={onProgressBarClick}
      onMouseMove={onMouseMoveHandler}
      onMouseLeave={onMouseLeaveHandler}
      data-tooltip-content="0:00"
      data-tooltip-id="progress-bar-tooltip"
    >
      <animated.div
        style={{
          ...style,
          minHeight: height,
          backgroundColor: progressBarColor,
        }}
        className="h-full"
      />

      {viewScreen?.type === screenType.VIDEO && (
        <Tooltip
          id="progress-bar-tooltip"
          float
          variant="light"
          render={() => {
            if (!tooltipInfo.videoDuration || !percentageOnMouseMove) {
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

      {viewScreen?.type === screenType.SLIDESHOW && (
        <Tooltip
          id="progress-bar-tooltip"
          float
          variant="light"
          render={() => {
            if (
              !tooltipInfo.imageUrlsFromSlideshow ||
              !percentageOnMouseMove ||
              !photosPercentages
            ) {
              return <></>;
            }
            const images = tooltipInfo.imageUrlsFromSlideshow;

            const photoIndex = getScreenPhotoIndex(
              percentageOnMouseMove,
              photosPercentages
            );

            if (photoIndex === null) {
              return <></>;
            }

            return (
              <img
                className="w-44 h-24 object-cover"
                src={images[photoIndex]}
                alt="Nahled obrazku zo slideshow"
              />
            );
          }}
        />
      )}
    </div>
  );
};
