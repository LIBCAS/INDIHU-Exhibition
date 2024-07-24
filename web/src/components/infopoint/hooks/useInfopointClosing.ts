import { useCallback, Dispatch, SetStateAction } from "react";

import {
  InfopointStatusMap,
  InfopointSupportedScreens,
} from "../useTooltipInfopoint";

import {
  GameQuizScreen,
  ImageScreen,
  ImageChangeScreen,
  SlideshowScreen,
} from "models";

import { screenType } from "enums/screen-type";

// - - - -

type UseInfopointClosingProps = {
  infopointStatusMap: InfopointStatusMap;
  setInfopointStatusMap: Dispatch<SetStateAction<InfopointStatusMap>>;
};

export const useInfopointClosing = ({
  infopointStatusMap,
  setInfopointStatusMap,
}: UseInfopointClosingProps) => {
  // 1. Iterates through whole map and closes all of the infopoints
  const closeAllInfopoints = useCallback(() => {
    if (!infopointStatusMap) {
      return;
    }

    const entries = Object.entries(infopointStatusMap);
    const closedEntries = entries.map(([key, infopoint]) => {
      return [key, { ...infopoint, isOpen: false }];
    });

    const newMap = Object.fromEntries(closedEntries);
    setInfopointStatusMap(newMap);
  }, [infopointStatusMap, setInfopointStatusMap]);

  // 2. Iterates through whole map, but closes only infopoints of current photo (primary-key)
  const closePhotoInfopoints = useCallback(
    (photoIndex: number) => {
      if (!infopointStatusMap) {
        return;
      }
      const entries = Object.entries(infopointStatusMap);
      const closedEntries = entries.map(([key, infopoint]) => {
        const parsedPhotoKey = parseInt(key.charAt(0));
        if (!isNaN(parsedPhotoKey) && parsedPhotoKey === photoIndex) {
          return [key, { ...infopoint, isOpen: false }];
        }
        return [key, { ...infopoint }];
      });

      const newMap = Object.fromEntries(closedEntries);
      setInfopointStatusMap(newMap);
    },
    [infopointStatusMap, setInfopointStatusMap]
  );

  // 3. Wrapper for closing infopoints for particular screen
  // Called e.g. when ESC was pressed or when clicking on the image outside any infopoint
  // NOTE: Typescript method overloading
  function closeInfopoints(screen: GameQuizScreen): () => void;
  function closeInfopoints(screen: ImageScreen): () => void;
  function closeInfopoints(screen: ImageChangeScreen): () => void;
  function closeInfopoints(
    screen: SlideshowScreen
  ): (photoIndex: number) => void;
  function closeInfopoints(screen: InfopointSupportedScreens) {
    if (screen.type === screenType.SLIDESHOW) {
      return closePhotoInfopoints;
    }
    return closeAllInfopoints;
  }

  return { closeInfopoints };
};
