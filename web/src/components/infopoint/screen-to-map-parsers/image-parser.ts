import { ImageScreen } from "models";
import { InfopointStatusObject } from ".";

export const parseImageScreenMap = (viewScreen: ImageScreen) => {
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

  return infopointsMap as Record<string, InfopointStatusObject>;
};
