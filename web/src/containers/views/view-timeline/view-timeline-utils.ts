import {
  Infopoint,
  Size,
  TimelineLeftBoundary,
  TimelineRightBoundary,
  TimelineType,
} from "models";
import { TIMELINE_CONTAINER_SIZE } from "containers/expo-administration/expo-editor/screen-timeline/components/TimelineBox";

// - - - - - -

export const calculateInfopointsPosition = (
  infopoints: Infopoint[] | undefined,
  parentSize: Size
) => {
  const adjustedInfopoints = infopoints?.map<Infopoint>((ip) => {
    const wPercentage = ip.left / TIMELINE_CONTAINER_SIZE.width;
    const hPercentage = ip.top / TIMELINE_CONTAINER_SIZE.height;

    const adjustedLeft = wPercentage * parentSize.width;
    const adjustedTop = hPercentage * parentSize.height;

    return {
      ...ip,
      left: adjustedLeft,
      top: adjustedTop,
    };
  });

  return adjustedInfopoints ?? [];
};

// - - - - - -

export const calculateArrowThickness = (
  thickness: number,
  returnBig: boolean
) => {
  if (thickness <= 1) {
    const finalThickness = 1;
    const big = finalThickness * 6;
    const small = finalThickness * 6;
    const toReturn = returnBig ? big : small;
    return toReturn;
  }

  const big = thickness * 6;
  const small = (thickness - 1) * 6;
  const toReturn = returnBig ? big : small;
  return toReturn;
};

// - - - - - -

export const calculateEdgeDecorationClassName = (
  timelineType: TimelineType,
  timelineLeftBoundary: TimelineLeftBoundary,
  timelineRightBoundary: TimelineRightBoundary
) => {
  // NOTE: First handle vertical timeline type
  if (timelineType === "VERTICAL") {
    const leftBoundary =
      timelineLeftBoundary === "NOTHING"
        ? "beginning-nothing-vertical"
        : timelineLeftBoundary === "LINE_SEGMENT"
        ? "beginning-segment-vertical"
        : timelineLeftBoundary === "DOT"
        ? "beginning-dot-vertical"
        : "unknown";

    const rightBoundary =
      timelineRightBoundary === "NOTHING"
        ? "end-nothing-vertical"
        : timelineRightBoundary === "LINE_SEGMENT"
        ? "end-segment-vertical"
        : timelineRightBoundary === "ARROW"
        ? "end-arrow-vertical"
        : "unknown";

    const verticalClassName = `timeline-line ${leftBoundary} ${rightBoundary}`;
    return verticalClassName;
  }

  // NOTE: Horizontal and diagonals, for some reason, belongs to the same category here
  const leftBoundary =
    timelineLeftBoundary === "NOTHING"
      ? "beginning-nothing-horizontal"
      : timelineLeftBoundary === "LINE_SEGMENT"
      ? "beginning-segment-horizontal"
      : timelineLeftBoundary === "DOT"
      ? "beginning-dot-horizontal"
      : "unknown";

  const rightBoundary =
    timelineRightBoundary === "NOTHING"
      ? "end-nothing-horizontal"
      : timelineRightBoundary === "LINE_SEGMENT"
      ? "end-segment-horizontal"
      : timelineRightBoundary === "ARROW"
      ? "end-arrow-horizontal"
      : "unknown";

  const horizontalClassName = `timeline-line ${leftBoundary} ${rightBoundary}`;
  return horizontalClassName;
};
