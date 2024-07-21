import { ImageChangeScreen } from "models";
import { InfopointStatusMap } from "../useTooltipInfopoint";

export const parseImageChangeScreenMap = (viewScreen: ImageChangeScreen) => {
  const infopointsMapFirst = viewScreen?.image1Infopoints?.reduce(
    (acc, currInfopoint, currInfopointIndex) => {
      return {
        ...acc,
        [`0-${currInfopointIndex}`]: {
          isOpen: currInfopoint.alwaysVisible,
          isAlwaysVisible: currInfopoint.alwaysVisible,
        },
      };
    },
    {}
  );

  const infopointsMapSecond = viewScreen?.image2Infopoints?.reduce(
    (acc, currInfopoint, currInfopointIndex) => {
      return {
        ...acc,
        [`1-${currInfopointIndex}`]: {
          isOpen: currInfopoint.alwaysVisible,
          isAlwaysVisible: currInfopoint.alwaysVisible,
        },
      };
    },
    {}
  );

  const infopointsMap = { ...infopointsMapFirst, ...infopointsMapSecond };
  return infopointsMap as InfopointStatusMap;
};
