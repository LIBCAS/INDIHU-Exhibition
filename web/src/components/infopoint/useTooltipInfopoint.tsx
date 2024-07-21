import { useState, useCallback } from "react";

import { useMobileInfopointAutoClosing } from "./hooks/useMobileInfopointAutoClosing";

// Components
import ScreenAnchorInfopoint from "./ScreenAnchorInfopoint";
import TooltipInfoPoint from "./TooltipInfopoint";

// Utils
import { parseScreenToInfopointStatusMap } from "./screen-to-map-parsers";

// Models
import {
  ImageScreen,
  SlideshowScreen,
  ImageChangeScreen,
  GameQuizScreen,
} from "models";

import { screenType } from "enums/screen-type";

// - - - - -

export type InfopointSupportedScreens =
  | ImageScreen
  | SlideshowScreen
  | ImageChangeScreen
  | GameQuizScreen;

export type InfopointStatusObject = {
  isOpen: boolean;
  isAlwaysVisible: boolean;
};

export type InfopointStatusMap = Record<string, InfopointStatusObject>;

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
  const [isMapParsingDone, setIsMapParsingDone] = useState<boolean>(false);

  // Object containing information (isOpen, isAlwaysVisible) for each infopoint present in supported screen
  // isAlwaysVisible is the mark for each infopoint, set in the slideshow administration
  const [infopointStatusMap, setInfopointStatusMap] =
    useState<InfopointStatusMap>(() => {
      const parsedInfopointMap = parseScreenToInfopointStatusMap(viewScreen);
      setIsMapParsingDone(true);
      return parsedInfopointMap;
    });

  // - - -

  useMobileInfopointAutoClosing({
    setInfopointStatusMap,
    isMapParsingDone,
  });

  // - - -

  // Iterates through whole map and close all of the infopoints
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
  }, [infopointStatusMap]);

  // Iterates through whole map, but close only infopoints of current photo
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
    [infopointStatusMap]
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
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints,
    ScreenAnchorInfopoint,
    TooltipInfoPoint,
  };
};

export default useTooltipInfopoint;
