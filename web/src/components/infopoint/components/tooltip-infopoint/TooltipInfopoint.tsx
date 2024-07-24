import { useState, Dispatch, SetStateAction } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { Tooltip } from "react-tooltip";
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
};

const TooltipInfoPoint = ({
  id,
  infopoint,
  infopointStatusMap,
  setInfopointStatusMap,
  primaryKey,
  secondaryKey,
  canBeOpen = true,
}: TooltipInfoPointProps) => {
  const { isLightMode } = useExpoDesignData();
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false); // infopoints's video if video type

  const currTooltipEl = document.querySelector<HTMLDivElement>(`#${id}`);
  const currTooltipPlacement = currTooltipEl?.classList.contains(
    "react-tooltip__place-top"
  )
    ? "top"
    : currTooltipEl?.classList.contains("react-tooltip__place-left")
    ? "left"
    : currTooltipEl?.classList.contains("react-tooltip__place-bottom")
    ? "bottom"
    : currTooltipEl?.classList.contains("react-tooltip__place-right")
    ? "right"
    : undefined;

  const keyMap =
    secondaryKey === undefined
      ? `${primaryKey}`
      : `${primaryKey}-${secondaryKey}`;

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
    />
  );
};

export default TooltipInfoPoint;
