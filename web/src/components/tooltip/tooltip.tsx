import { Tooltip as ReactTooltip, PlacesType } from "react-tooltip";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

type TooltipProps = {
  id: string;
  content: string;
  variant?: "light" | "dark";
  place?: PlacesType;
  className?: string;
};

/**
 * Basic tooltip which listens to theme changes if variant is not overridden by prop
 */
export const BasicTooltip = ({
  id,
  content,
  variant,
  place,
  className,
}: TooltipProps) => {
  const { isLightMode } = useExpoDesignData();
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
