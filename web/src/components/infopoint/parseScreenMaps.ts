import { ImageScreen, SlideshowScreen, ImageChangeScreen } from "models";

export type InfopointStatusObject = {
  isOpen: boolean;
  isAlwaysVisible: boolean;
};

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
  return infopointsMap as Record<string, InfopointStatusObject>;
};
