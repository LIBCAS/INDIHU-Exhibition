import { GameSizingScreen } from "models";
import { InfopointStatusMap } from "../useTooltipInfopoint";

export const parseGameSizingScreenMap = (viewScreen: GameSizingScreen) => {
  const infopointsMap = viewScreen?.infopoints3?.reduce(
    (acc, currInfopoint, currInfopointIdx) => {
      return {
        ...acc,
        [`${currInfopointIdx}`]: {
          isOpen: currInfopoint.alwaysVisible,
          isAlwaysVisible: currInfopoint.alwaysVisible,
        },
      };
    },
    {}
  );

  return infopointsMap as InfopointStatusMap;
};
