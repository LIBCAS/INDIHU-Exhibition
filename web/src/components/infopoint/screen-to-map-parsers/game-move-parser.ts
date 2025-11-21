import { GameMoveScreen } from "models";
import { InfopointStatusMap } from "../useTooltipInfopoint";

export const parseGameMoveScreenMap = (viewScreen: GameMoveScreen) => {
  const infopointsMap = viewScreen?.image2Infopoints?.reduce(
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
