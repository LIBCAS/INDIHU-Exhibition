import { useState, Dispatch, SetStateAction } from "react";
import { Tooltip } from "react-tooltip";

import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import InfopointBody from "./InfopointBody";

import { InfopointStatusObject } from "./screen-to-map-parsers";
import { Infopoint } from "models";

import cx from "classnames";
import { getTooltipArrowBorderClassName } from "utils/view-utils";

type TooltipInfoPointProps = {
  id: string;
  infopoint: Infopoint;
  infopointOpenStatusMap: Record<string, InfopointStatusObject>;
  setInfopointOpenStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
  primaryKey: string;
  secondaryKey?: string;
  canBeOpen?: boolean;
};

const TooltipInfoPoint = (props: TooltipInfoPointProps) => {
  const keyMap =
    props.secondaryKey === undefined
      ? `${props.primaryKey}`
      : `${props.primaryKey}-${props.secondaryKey}`;

  return <BasicTooltipInfopoint {...props} keyMap={keyMap} />;
};

export default TooltipInfoPoint;

// - - - -

interface Props {
  id: string;
  infopoint: Infopoint;
  infopointOpenStatusMap: Record<string, InfopointStatusObject>;
  setInfopointOpenStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
  keyMap: string;
  canBeOpen?: boolean;
}

const BasicTooltipInfopoint = ({
  id,
  infopoint,
  infopointOpenStatusMap,
  setInfopointOpenStatusMap,
  keyMap,
  canBeOpen = true,
}: Props) => {
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
          setInfopointOpenStatusMap((prevMap) => ({
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
      isOpen={infopointOpenStatusMap[keyMap].isOpen && canBeOpen}
      setIsOpen={(isOpen) => {
        if (isOpen) {
          setInfopointOpenStatusMap((prevMap) => ({
            ...prevMap,
            [keyMap]: { ...prevMap[keyMap], isOpen: !prevMap[keyMap].isOpen },
          }));
        }
      }}
      afterHide={() => setIsVideoLoaded(false)}
    />
  );
};
