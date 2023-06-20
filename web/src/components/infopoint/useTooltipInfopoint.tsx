import { useState, useCallback } from "react";

// Components
import SquareInfopoint from "./SquareInfopoint";
import TooltipInfoPoint from "./TooltipInfopoint";

// Utils
import {
  parseImageScreenMap,
  parsePhotoGalleryScreenMap,
} from "./parseScreenMaps";

// Models
import { ImageScreen, PhotogaleryScreen } from "models";

// - - - - -

/**
 * 1. Import this hook into screen where you want to use Infopoints
 * 2. Implement map parser for your type of screen, currently implemented parsers are highly usable
 *     - map as Record<string, InfopointStatusObject>
 *     - e.g { '0-0': { isOpen: true, isAlwaysVisible: false }, '0-1': { isOpen: false, isAlwaysVisible: true }, ... }
 *     - key of type string, convention like '0-0', '0-1', '1-0', ... OR '0', '1', '2', ...
 *     - one entry of this map represent information about one infopoint at given screen, whether
 *       the infopoint is currently opened or closed or whether is marked as alwaysVisible
 *     - alwaysVisible in czech "stale zobrazen", is a checkbox in screen administration
 * 3. Use SquareInfopoint component in your screen
 *     - requires top and left props as absolute offset positioning
 *     - requires id and content prop, which is used as data-tooltip-id, data-tooltip-content
 *     - id of SquareInfopoint must be the same as the id prop of TooltipInfopoint
 *     - content of SquareInfopoint will be through id linked and used in TooltipInfopoint
 * 4. Apply TooltipInfopoint component
 *     - requires id props which must be the same as the supplied id in SquareInfopoint
 *     - requires information whether this infopoint is marked as alwaysVisible from administration
 *     - requires infopointOpenStatusMap and setter of this map.. created in first step and returned by this hook
 *     - requires primary and optionally secondary key, they will be combined into one mapKey
 *       e.g '0-0' or '0' if secondary is not supplied
 *     - optionally canBeOpen, which will prevent opening the TooltipInfopoint even when clicked on SquareInfopoint
 * EXAMPLES: PHOTOGALERY screen or IMAGE screen
 */
const useTooltipInfopoint = (viewScreen: PhotogaleryScreen | ImageScreen) => {
  // Object containing information (isOpen, isAlwaysVisible) for each infopoint from all the images
  // isAlwaysVisible is the mark for each infopoint, set in the photogallery administration
  const [infopointOpenStatusMap, setInfopointOpenStatusMap] = useState(() => {
    if (viewScreen.type === "PHOTOGALERY") {
      return parsePhotoGalleryScreenMap(viewScreen);
    }
    return parseImageScreenMap(viewScreen);
  });

  // Function which will close all infopoints, which are not 'alwaysVisible'
  // Called e.g on ESC press + clicking on the image as outside any infopoint
  const closeInfopoints = useCallback(() => {
    const entries = Object.entries(infopointOpenStatusMap);
    const closedEntries = entries.map(([key, infopoint]) => {
      if (infopoint.isAlwaysVisible) {
        return [key, { ...infopoint }];
      }
      return [key, { ...infopoint, isOpen: false }];
    });

    const newMap = Object.fromEntries(closedEntries);
    setInfopointOpenStatusMap(newMap);
  }, [infopointOpenStatusMap]);

  return {
    infopointOpenStatusMap,
    setInfopointOpenStatusMap,
    closeInfopoints,
    SquareInfopoint,
    TooltipInfoPoint,
  };
};

export default useTooltipInfopoint;
