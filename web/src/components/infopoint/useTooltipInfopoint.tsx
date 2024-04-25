import { useState, useCallback, useEffect } from "react";

// Components
import ScreenAnchorInfopoint from "./ScreenAnchorInfopoint";
import TooltipInfoPoint from "./TooltipInfopoint";

import { useMediaQuery } from "@mui/material";
import { breakpoints } from "hooks/media-query-hook/breakpoints";

// Utils
import {
  parseImageScreenMap,
  parseSlideshowScreenMap,
  parseImageChangeScreenMap,
  parseGameQuizScreenMap,
  InfopointStatusObject,
} from "./parseScreenMaps";

// Models
import {
  ImageScreen,
  SlideshowScreen,
  ImageChangeScreen,
  GameQuizScreen,
} from "models";
import { screenType } from "enums/screen-type";

// - - - - -

type InfopointSupportedScreens =
  | ImageScreen
  | SlideshowScreen
  | ImageChangeScreen
  | GameQuizScreen;

/**
 * 1. Import this hook into screen where you want to use Infopoints
 * 2. Implement map parser for your type of screen, currently implemented parsers are highly usable
 *     - map as Record<string, InfopointStatusObject>
 *     - e.g { '0-0': { isOpen: true, isAlwaysVisible: false }, '0-1': { isOpen: false, isAlwaysVisible: true }, ... }
 *     - key of type string, convention like '0-0', '0-1', '1-0', ... OR '0', '1', '2', ...
 *     - one entry of this map represent information about one infopoint at given screen, whether
 *       the infopoint is currently opened or closed
 *     - alwaysVisible in czech "stale zobrazen", is a checkbox in screen administration
 *     - alwaysVisible infopoint is at the beginning open, thats the only difference from another infopoint
 * 3. Use ScreenAnchorInfopoint component in your screen
 *     - requires top and left props as absolute offset positioning
 *     - requires id and content prop, which is used as data-tooltip-id, data-tooltip-content
 *     - id of SquareInfopoint must be the same as the id prop of TooltipInfopoint
 *     - content of SquareInfopoint will be through id linked and used in TooltipInfopoint
 * 4. Apply TooltipInfopoint component
 *     - requires id props which must be the same as the supplied id in ScreenAnchorInfopoint
 *     - requires information whether this infopoint is marked as alwaysVisible from administration
 *     - requires infopointOpenStatusMap and setter of this map.. created in first step and returned by this hook
 *     - requires primary and optionally secondary key, they will be combined into one mapKey
 *       e.g '0-0' or '0' if secondary is not supplied
 *     - optionally canBeOpen, which will prevent opening the TooltipInfopoint even when clicked on SquareInfopoint
 * EXAMPLES: SLIDESHOW screen or IMAGE screen
 */
const useTooltipInfopoint = (viewScreen: InfopointSupportedScreens) => {
  const isSm = useMediaQuery(breakpoints.down("sm"));

  const [isMapParsingDone, setIsMapParsingDone] = useState<boolean>(false);

  // Object containing information (isOpen, isAlwaysVisible) for each infopoint present in supported screen
  // isAlwaysVisible is the mark for each infopoint, set in the slideshow administration
  const [infopointOpenStatusMap, setInfopointOpenStatusMap] = useState(() => {
    let parsedInfopointStatusMap: Record<string, InfopointStatusObject> | null =
      null;

    if (viewScreen.type === screenType.GAME_OPTIONS) {
      parsedInfopointStatusMap = parseGameQuizScreenMap(viewScreen);
    } else if (viewScreen.type === screenType.SLIDESHOW) {
      parsedInfopointStatusMap = parseSlideshowScreenMap(viewScreen);
    } else if (viewScreen.type === screenType.IMAGE_CHANGE) {
      parsedInfopointStatusMap = parseImageChangeScreenMap(viewScreen);
    } else {
      // TODO - improve structure
      parsedInfopointStatusMap = parseImageScreenMap(viewScreen);
    }

    setIsMapParsingDone(true);
    return parsedInfopointStatusMap;
  });

  // - - -

  // On small (mobile) screens, all infopoint, even the alwaysVisible, are by default first closed and then could be opened
  useEffect(() => {
    if (!isSm) {
      setInfopointOpenStatusMap((prevMap) => {
        if (!prevMap) {
          return prevMap;
        }
        const entries = Object.entries(prevMap);
        const nextMap = entries.reduce(
          (acc, [key, infopointStatus]) => ({
            ...acc,
            [key]: {
              ...infopointStatus,
              isOpen: infopointStatus.isAlwaysVisible,
            },
          }),
          {} as Record<string, InfopointStatusObject>
        );

        return nextMap;
      });

      return;
    }

    setInfopointOpenStatusMap((prevMap) => {
      if (!prevMap) {
        return prevMap;
      }
      const entries = Object.entries(prevMap);
      const nextMapWithClosedInfopoints = entries.reduce(
        (acc, [key, infopointStatus]) => ({
          ...acc,
          [key]: { ...infopointStatus, isOpen: false },
        }),
        {} as Record<string, InfopointStatusObject>
      );

      return nextMapWithClosedInfopoints;
    });
  }, [isSm, isMapParsingDone]);

  // - - -

  // Iterates through whole map and close all of the infopoints
  const closeAllInfopoints = useCallback(() => {
    if (!infopointOpenStatusMap) {
      return;
    }
    const entries = Object.entries(infopointOpenStatusMap);
    const closedEntries = entries.map(([key, infopoint]) => {
      return [key, { ...infopoint, isOpen: false }];
    });

    const newMap = Object.fromEntries(closedEntries);
    setInfopointOpenStatusMap(newMap);
  }, [infopointOpenStatusMap]);

  // Iterates through whole map, but close only infopoints of current photo
  const closePhotoInfopoints = useCallback(
    (photoIndex: number) => {
      if (!infopointOpenStatusMap) {
        return;
      }
      const entries = Object.entries(infopointOpenStatusMap);
      const closedEntries = entries.map(([key, infopoint]) => {
        const parsedPhotoKey = parseInt(key.charAt(0));
        if (!isNaN(parsedPhotoKey) && parsedPhotoKey === photoIndex) {
          return [key, { ...infopoint, isOpen: false }];
        }
        return [key, { ...infopoint }];
      });

      const newMap = Object.fromEntries(closedEntries);
      setInfopointOpenStatusMap(newMap);
    },
    [infopointOpenStatusMap]
  );

  // - - -

  // Function which will close infopoints
  // Called e.g on ESC press + clicking on the image as outside any infopoint
  // Typescript method overloading
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

  return {
    infopointOpenStatusMap,
    setInfopointOpenStatusMap,
    closeInfopoints,
    ScreenAnchorInfopoint,
    TooltipInfoPoint,
  };
};

export default useTooltipInfopoint;
