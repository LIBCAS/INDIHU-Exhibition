import { GameDrawScreen } from "models";
import { InfopointStatusMap } from "../useTooltipInfopoint";

export const parseGameDrawScreenMap = (viewScreen: GameDrawScreen) => {
  const infopointsMap = viewScreen?.infopoints1?.reduce(
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
