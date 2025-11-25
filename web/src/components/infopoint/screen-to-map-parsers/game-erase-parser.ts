import { GameWipeScreen } from "models";
import { InfopointStatusMap } from "../useTooltipInfopoint";

export const parseGameEraseScreenMap = (viewScreen: GameWipeScreen) => {
  const infopointsMapFirst = viewScreen?.infopoints1?.reduce(
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

  const infopointsMapSecond = viewScreen?.infopoints2?.reduce(
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
