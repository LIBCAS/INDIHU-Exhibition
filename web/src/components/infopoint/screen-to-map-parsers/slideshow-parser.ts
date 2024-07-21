import { SlideshowScreen } from "models";
import { InfopointStatusObject } from ".";

export const parseSlideshowScreenMap = (viewScreen: SlideshowScreen) => {
  const infopointsMap = viewScreen.images?.reduce(
    (acc, currImage, currImageIndex) => {
      const reducedImage = currImage.infopoints.reduce(
        (innerAcc, currInfopoint, currInfopointIndex) => {
          return {
            ...innerAcc,
            [`${currImageIndex}-${currInfopointIndex}`]: {
              isOpen: currInfopoint.alwaysVisible,
              isAlwaysVisible: currInfopoint.alwaysVisible,
            },
          };
        },
        {}
      );

      return { ...acc, ...reducedImage };
    },
    {}
  );

  return infopointsMap as Record<string, InfopointStatusObject>;
};
