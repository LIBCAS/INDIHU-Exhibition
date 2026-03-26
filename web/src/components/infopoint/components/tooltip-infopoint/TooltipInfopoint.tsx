import { useState, Dispatch, SetStateAction } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { Tooltip, PlacesType } from "react-tooltip";
import InfopointBody from "./InfopointBody";

// Models
import { InfopointStatusObject } from "../../useTooltipInfopoint";
import { Infopoint } from "models";

// Utils
import cx from "classnames";
import { getTooltipArrowBorderClassName } from "utils/view-utils";

// - - - -

type TooltipInfoPointProps = {
  id: string;
  infopoint: Infopoint;
  infopointStatusMap: Record<string, InfopointStatusObject>;
  setInfopointStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
  primaryKey: string;
  secondaryKey?: string;
  canBeOpen?: boolean;
  place?: PlacesType;
};

const TooltipInfoPoint = ({
  id,
  infopoint,
  infopointStatusMap,
  setInfopointStatusMap,
  primaryKey,
  secondaryKey,
  canBeOpen = true,
  place,
}: TooltipInfoPointProps) => {
  const { isLightMode } = useExpoDesignData();
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false); // infopoints's video if video type

  const keyMap =
    secondaryKey === undefined
      ? `${primaryKey}`
      : `${primaryKey}-${secondaryKey}`;

  const currTooltipEl = document.querySelector<HTMLDivElement>(`#${id}`);
  const currTooltipPlacement: PlacesType | undefined =
    currTooltipEl?.classList.contains("react-tooltip__place-top")
      ? "top"
      : currTooltipEl?.classList.contains("react-tooltip__place-top-start")
      ? "top-start"
      : currTooltipEl?.classList.contains("react-tooltip__place-top-end")
      ? "top-end"
      : currTooltipEl?.classList.contains("react-tooltip__place-left")
      ? "left"
      : currTooltipEl?.classList.contains("react-tooltip__place-left-start")
      ? "left-start"
      : currTooltipEl?.classList.contains("react-tooltip__place-left-end")
      ? "left-end"
      : currTooltipEl?.classList.contains("react-tooltip__place-bottom")
      ? "bottom"
      : currTooltipEl?.classList.contains("react-tooltip__place-bottom-start")
      ? "bottom-start"
      : currTooltipEl?.classList.contains("react-tooltip__place-bottom-end")
      ? "bottom-end"
      : currTooltipEl?.classList.contains("react-tooltip__place-right")
      ? "right"
      : currTooltipEl?.classList.contains("react-tooltip__place-right-start")
      ? "right-start"
      : currTooltipEl?.classList.contains("react-tooltip__place-right-end")
      ? "right-end"
      : undefined;

  return (
    <Tooltip
      id={id}
      className={cx(
        "!pointer-events-auto !opacity-100 !rounded-none shadow-md shadow-neutral-600 border-solid border-[1px] z-10",
        {
          "border-black": isLightMode,
          "border-white": !isLightMode,
        }
      )}
      classNameArrow={getTooltipArrowBorderClassName({
        isLightMode: isLightMode,
        placement: currTooltipPlacement,
      })}
      variant={isLightMode ? "light" : "dark"}
      clickable
      openOnClick
      render={() => {
        const closeThisInfopoint = () => {
          setInfopointStatusMap((prevMap) => ({
            ...prevMap,
            [keyMap]: { ...prevMap[keyMap], isOpen: false },
          }));
        };

        return InfopointBody({
          infopoint,
          onClose: closeThisInfopoint,
          isVideoLoaded,
          setIsVideoLoaded,
        });
      }}
      isOpen={infopointStatusMap[keyMap].isOpen && canBeOpen}
      setIsOpen={(isOpen) => {
        if (isOpen) {
          setInfopointStatusMap((prevMap) => ({
            ...prevMap,
            [keyMap]: { ...prevMap[keyMap], isOpen: !prevMap[keyMap].isOpen },
          }));
        }
      }}
      afterHide={() => setIsVideoLoaded(false)}
      place={place}
    />
  );
};

export default TooltipInfoPoint;
