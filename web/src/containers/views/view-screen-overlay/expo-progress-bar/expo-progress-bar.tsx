import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { animated, useSpring } from "react-spring";
import { useScreenChapters } from "components/dialogs/chapters-dialog/screen-chapters-hook";
import { useExpoProgressBarTooltip } from "./expo-progress-bar-tooltip-hook";

import { Tooltip } from "react-tooltip";
import { NavLink, useParams } from "react-router-dom";

import { AppState } from "store/store";
import { ScreenChapters } from "components/dialogs/chapters-dialog/types";
import { ScreenPoint } from "./types";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo?.viewExpo?.structure?.screens,
  ({ expo }: AppState) => expo?.viewExpo?.url,
  ({ expo }: AppState) => expo.viewExpo?.structure.start,
  (screens, url, start) => ({ screens, url, start })
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
  const { screens, url, start } = useSelector(stateSelector);
  const { section: UrlSection, screen: UrlScreen } = useParams<{
    section: string;
    screen: string;
  }>();
  let screenChapters = useScreenChapters(screens);

  const startScreenChapter = {
    ...start,
    sectionIndex: "start",
    screenIndex: undefined,
  } as ScreenChapters;

  screenChapters = [startScreenChapter, ...(screenChapters ?? [])];

  // TODO: components rerenders really often, figure out why

  const screenPoints = useMemo(
    () =>
      screenChapters?.reduce<ScreenPoint[]>(
        (acc, currentScreenChapter) => [
          ...acc,
          ...flattenScreensRecursively(currentScreenChapter),
        ],
        []
      ) ?? [],
    [screenChapters]
  );

  const { renderTooltip } = useExpoProgressBarTooltip(screenPoints);

  // currentScreenIndex and maxScreenIndex used for width in %
  const maxScreenIndex = useMemo(() => screenPoints.length + 1, [screenPoints]);

  let currentScreenIndex = 0;
  if (UrlSection === "start") {
    currentScreenIndex = 1;
  } else {
    currentScreenIndex =
      screenPoints.findIndex(
        (screenPoint: ScreenPoint) =>
          screenPoint.sectionIndex.toString() === UrlSection &&
          screenPoint.screenIndex?.toString() === UrlScreen
      ) + 1;
  }

  // For filling purpose
  const { width } = useSpring({
    width: `${(currentScreenIndex / maxScreenIndex) * 100}%`,
  });

  return (
    <>
      <div className="w-full h-full flex justify-evenly border-t-2 border-t-muted bg-white bg-opacity-40 items-center relative">
        {screenPoints.map(({ sectionIndex, screenIndex, type }, index) => (
          <div
            className="flex h-full items-center justify-end flex-1"
            key={`${sectionIndex}-${screenIndex}`}
          >
            {type === "START" ? (
              <NavLink
                className="h-2.5 w-2.5 bg-black z-10 hover:cursor-pointer translate-x-1/2 rounded-sm"
                to={`/view/${url}/start`}
                // Add the Tooltip with the Image!
                data-tooltip-content={index.toString()}
                data-tooltip-id="progress-bar-screen-preview-tooltip"
              />
            ) : type === "INTRO" ? (
              <NavLink
                to={`/view/${url}/${sectionIndex}/${screenIndex}`}
                data-tooltip-content={index.toString()}
                data-tooltip-id="progress-bar-screen-preview-tooltip"
                className="h-2.5 w-2.5 bg-black z-10 hover:cursor-pointer translate-x-1/2 rounded-sm"
              />
            ) : (
              <NavLink
                to={`/view/${url}/${sectionIndex}/${screenIndex}`}
                data-tooltip-content={index.toString()}
                data-tooltip-id="progress-bar-screen-preview-tooltip"
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

      {/* Tooltip on hover for chapters with image */}
      <Tooltip
        id="progress-bar-screen-preview-tooltip"
        float={false}
        variant="light"
        delayHide={500}
        className="!pointer-events-auto !opacity-100 !rounded-none shadow-md"
        render={({ content }) => renderTooltip(content ?? "neuvedeno")}
      />
    </>
  );
};
