import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, useSpring } from "react-spring";
import { useHistory, useParams } from "react-router-dom";

// Custom hooks
import { useScreenChapters } from "hooks/view-hooks/screen-chapters-hook";
import { useExpoProgressBarTooltip } from "./expo-progress-bar-tooltip-hook";

// Components
import { Tooltip } from "react-tooltip";

// Models
import { AppState } from "store/store";
import { ScreenChapters, ScreenPoint } from "models";

// - - - - - - - - - -

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

// - - - - - - - - - -

interface ExpoProgressBarProps {
  isProgressbarHovered: boolean;
}

export const ExpoProgressBar = ({
  isProgressbarHovered,
}: ExpoProgressBarProps) => {
  const { screens, url, start } = useSelector(stateSelector);
  const { section: urlSection, screen: urlScreen } = useParams<{
    section: string;
    screen: string;
  }>();
  const { push } = useHistory();

  // - - -

  // Array of ScreenChapters, one item represents INTRO chapter screen with additional sectionIndex, screenIndex + subScreens
  let screenChapters = useScreenChapters(screens);

  const startScreenChapter = {
    ...start,
    sectionIndex: "start",
    screenIndex: undefined,
  } as ScreenChapters;

  screenChapters = [startScreenChapter, ...(screenChapters ?? [])];

  // - - -

  // TODO: components rerenders really often, figure out why

  // Array of ScreenPoint, where one ScreenPoint for each screen, not just INTRO screen, with additional sectionIndex, screenIndex, without subScreens
  // Used for dots which are displayed in the bottom progressbar
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

  // - - -

  const { renderTooltip } = useExpoProgressBarTooltip(screenPoints);

  // maxScreenIndex currentScreenIndex and  used for width in %
  const maxScreenIndex = useMemo(() => screenPoints.length + 1, [screenPoints]);

  let currentScreenIndex = 0;
  if (urlSection === "start") {
    currentScreenIndex = 1;
  } else {
    currentScreenIndex =
      screenPoints.findIndex(
        (screenPoint: ScreenPoint) =>
          screenPoint.sectionIndex.toString() === urlSection &&
          screenPoint.screenIndex?.toString() === urlScreen
      ) + 1;
  }

  // For animation of the filling of the progressbar
  const { width } = useSpring({
    width: `${(currentScreenIndex / maxScreenIndex) * 100}%`,
  });

  // Animation of hovered progessbar, squares are being larger
  const { edge } = useSpring({
    edge: isProgressbarHovered ? "0.65rem" : "0.5rem",
  });

  return (
    <>
      <div className="w-full h-full flex justify-evenly items-center bg-muted-400 border-t-4 border-t-muted relative">
        {screenPoints.map(({ sectionIndex, screenIndex, type }, index) => (
          <div
            className="flex h-full items-center justify-end flex-1"
            key={`${sectionIndex}-${screenIndex}`}
          >
            {/* One black square for start screen, then black square for each INTRO screen and for each other screen the gray line */}
            {type === "START" ? (
              <animated.div
                className="w-2 h-2 bg-black z-10 hover:cursor-pointer hover:bg-primary translate-x-1/2 rounded-sm"
                data-tooltip-content={index.toString()}
                data-tooltip-id="progress-bar-screen-preview-tooltip"
                style={{ width: edge, height: edge }}
                onClick={() => push(`/view/${url}/start`)}
              />
            ) : type === "INTRO" ? (
              <animated.div
                className="bg-black z-10 hover:cursor-pointer hover:bg-primary translate-x-1/2 rounded-sm"
                data-tooltip-content={index.toString()}
                data-tooltip-id="progress-bar-screen-preview-tooltip"
                style={{ width: edge, height: edge }}
                onClick={() =>
                  push(`/view/${url}/${sectionIndex}/${screenIndex}`)
                }
              />
            ) : (
              <div
                className="h-full w-1.5 bg-black bg-opacity-25 hover:bg-primary hover:bg-opacity-100 z-10 translate-x-1/2 hover:cursor-pointer"
                data-tooltip-content={index.toString()}
                data-tooltip-id="progress-bar-screen-preview-tooltip"
                onClick={() =>
                  push(`/view/${url}/${sectionIndex}/${screenIndex}`)
                }
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
        place="top"
        delayHide={500}
        className="!pointer-events-auto !opacity-100 !rounded-none border-solid border-[1px] border-black"
        classNameArrow="border-b-[1px] border-b-solid border-b-black border-r-[1px] border-r-solid border-r-black"
        // content here in render is index.toString() sent by data-tooltip-content
        render={({ content }) => renderTooltip(content ?? "neuvedeno")}
      />
    </>
  );
};
