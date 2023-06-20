import { ImageScreen, PhotogaleryScreen } from "models";

export type InfopointStatusObject = {
  isOpen: boolean;
  isAlwaysVisible: boolean;
};

export const parsePhotoGalleryScreenMap = (viewScreen: PhotogaleryScreen) => {
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
