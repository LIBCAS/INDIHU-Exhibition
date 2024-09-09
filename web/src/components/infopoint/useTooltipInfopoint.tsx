import { useState } from "react";

import { useMobileInfopointAutoClosing } from "./hooks/useMobileInfopointAutoClosing";
import { useInfopointClosing } from "./hooks/useInfopointClosing";

// Components
import AnchorInfopoint from "./components/anchor-infopoint";
import TooltipInfoPoint from "./components/tooltip-infopoint/TooltipInfopoint";

// Utils
import { parseScreenToInfopointStatusMap } from "./screen-to-map-parsers";

// Models
import {
  ImageScreen,
  SlideshowScreen,
  ImageChangeScreen,
  GameQuizScreen,
} from "models";

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
 * 3. Use AnchorInfopoint component in your screen
 *     - requires top and left props as absolute offset positioning
 *     - requires id and content prop, which is used as data-tooltip-id, data-tooltip-content
 *     - id of SquareInfopoint must be the same as the id prop of TooltipInfopoint
 *     - content of SquareInfopoint will be through id linked and used in TooltipInfopoint
 * 4. Apply TooltipInfopoint component
 *     - requires id props which must be the same as the supplied id in AnchorInfopoint
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

  const { closeInfopoints } = useInfopointClosing({
    infopointStatusMap: infopointStatusMap,
    setInfopointStatusMap: setInfopointStatusMap,
  });

  return {
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints,
    AnchorInfopoint,
    TooltipInfoPoint,
  };
};

export default useTooltipInfopoint;
