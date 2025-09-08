import { TimelineScreen } from "models";
import { InfopointStatusMap } from "../useTooltipInfopoint";

export const parseTimelineScreenMap = (viewScreen: TimelineScreen) => {
  const infopointsMap = viewScreen?.infopoints?.reduce(
    (acc, currInfopoint, currInfopointIndex) => {
      return {
        ...acc,
        [`${currInfopointIndex}`]: {
          isOpen: currInfopoint.alwaysVisible,
          isAlwaysVisible: currInfopoint.alwaysVisible,
        },
      };
    },
    {}
  );

  return infopointsMap as InfopointStatusMap;
};
