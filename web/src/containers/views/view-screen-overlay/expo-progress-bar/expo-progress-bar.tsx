import { useScreenChapters } from "components/dialogs/chapters-dialog/screen-chapters-hook";
import { ScreenChapters } from "components/dialogs/chapters-dialog/types";
import { useSectionScreen } from "containers/views/hooks/section-screen-hook";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { createSelector } from "reselect";
import Tooltip from "react-tooltip";

import { AppState } from "store/store";

import { ScreenPoint } from "./types";
import { useExpoProgressBarTooltip } from "./expo-progress-bar-tooltip-hook";
import { NavLink } from "react-router-dom";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo?.viewExpo?.structure?.screens,
  ({ expo }: AppState) => expo?.viewExpo?.url,
  (screens, url) => ({ screens, url })
);

const flattenScreensRecursively = (
  screenChapter: ScreenChapters
): ScreenPoint[] => {
  if (!screenChapter.subScreens) {
    return [screenChapter];
  }

  const flattenedSubScreens = screenChapter.subScreens.reduce<ScreenPoint[]>(
    (acc, subScreen) => [...acc, ...flattenScreensRecursively(subScreen)],
    []
  );

  const { subScreens, ...screen } = screenChapter;

  return [screen, ...flattenedSubScreens];
};

export const ExpoProgressBar = () => {
  const { screens, url } = useSelector(stateSelector);
  const screenChapters = useScreenChapters(screens);
  const { section = 0, screen = 0 } = useSectionScreen();

  // TODO: components rerenders really often, figure out why

  const screenPoints = useMemo(
    () =>
      screenChapters?.reduce<ScreenPoint[]>(
        (acc, screenChapter) => [
          ...acc,
          ...flattenScreensRecursively(screenChapter),
        ],
        []
      ) ?? [],
    [screenChapters]
  );

  const { renderTooltip } = useExpoProgressBarTooltip(screenPoints);

  const currentScreenIndex = useMemo(() => {
    const totalFromPreviousSections =
      screenChapters?.reduce(
        (acc, screenChapter, index) =>
          index < section
            ? acc + (screenChapter?.subScreens?.length ?? 0) + 1
            : acc,
        0
      ) ?? 0;

    return totalFromPreviousSections + (screen !== undefined ? screen + 1 : 0);
  }, [screen, screenChapters, section]);

  const { width } = useSpring({
    width: `${(currentScreenIndex / (screenPoints.length + 1)) * 100}%`,
  });

  return (
    <>
      <div className="w-full h-full flex justify-evenly border-t-2 border-t-muted bg-white bg-opacity-40 items-center relative">
        {screenPoints.map(({ sectionIndex, screenIndex, type }, index) => (
          <div
            className="flex h-full items-center justify-end flex-1"
            key={`${sectionIndex}-${screenIndex}`}
          >
            {type === "INTRO" ? (
              <NavLink
                to={`/view/${url}/${sectionIndex}/${screenIndex}`}
                data-tip={index}
                data-for="progress-bar-screen-preview-tooltip"
                className="h-2.5 w-2.5 bg-black z-10 hover:cursor-pointer translate-x-1/2 rounded-sm"
              />
            ) : (
              <NavLink
                to={`/view/${url}/${sectionIndex}/${screenIndex}`}
                className="h-full w-1.5 bg-black bg-opacity-25 z-10 translate-x-1/2"
              />
            )}
          </div>
        ))}

        {/* needed so the last point is not all the way at the end */}
        <div className="flex justify-end flex-1" />

        {/* fill of the progress bar */}
        <animated.div
          className="top-0 bottom-0 left-0 bg-white absolute"
          style={{ width }}
        />
      </div>

      <Tooltip
        effect="solid"
        type="light"
        delayHide={500}
        id="progress-bar-screen-preview-tooltip"
        className="!pointer-events-auto !opacity-100 !rounded-none shadow-md"
        getContent={renderTooltip}
        offset={{ top: 10 }}
      />
    </>
  );
};
