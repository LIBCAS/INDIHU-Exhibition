import { useEffect, Dispatch, SetStateAction } from "react";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

import { InfopointStatusMap } from "../useTooltipInfopoint";

type UseMobileInfopointAutoClosingProps = {
  setInfopointStatusMap: Dispatch<SetStateAction<InfopointStatusMap>>;
  isMapParsingDone: boolean;
};

/**
 * On small (mobile) screens, all infopoints (even the 'isAlwaysVisible = true' ones) are by default closed first.
 */
export const useMobileInfopointAutoClosing = ({
  setInfopointStatusMap,
  isMapParsingDone,
}: UseMobileInfopointAutoClosingProps) => {
  const { isSm } = useMediaDevice();

  useEffect(() => {
    // Handle larger screens
    if (!isSm) {
      setInfopointStatusMap((prevMap) => {
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
          {} as InfopointStatusMap
        );

        return nextMap;
      });

      return;
    }

    // Handle mobile screens
    setInfopointStatusMap((prevMap) => {
      if (!prevMap) {
        return prevMap;
      }

      const entries = Object.entries(prevMap);
      const nextMapWithClosedInfopoints = entries.reduce(
        (acc, [key, infopointStatus]) => ({
          ...acc,
          [key]: { ...infopointStatus, isOpen: false },
        }),
        {} as InfopointStatusMap
      );

      return nextMapWithClosedInfopoints;
    });
  }, [isSm, isMapParsingDone, setInfopointStatusMap]);
};
