import { Tooltip as ReactTooltip } from "react-tooltip";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { BasicTooltipProps } from "./tooltip-props";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

/**
 * Basic tooltip which listens to theme changes if variant is not overridden by prop
 */
export const BasicTooltip = ({
  id,
  content,
  variant,
  place,
  className,
}: BasicTooltipProps) => {
  const { isLightMode } = useExpoDesignData();
  const { isMobile, isMobileLandscape } = useMediaDevice();

  if (isMobile || isMobileLandscape) {
    return null;
  }

  return (
    <ReactTooltip
      id={id}
      content={content}
      variant={variant ? variant : isLightMode ? "light" : "dark"}
      place={place}
      className={className}
    />
  );
};
