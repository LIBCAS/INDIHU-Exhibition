import { Infopoint, Size } from "models";
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
