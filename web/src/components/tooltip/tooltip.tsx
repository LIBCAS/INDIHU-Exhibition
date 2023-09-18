import { Tooltip as ReactTooltip } from "react-tooltip";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

type TooltipProps = {
  id: string;
  content: string;
};

/**
 * Basic tooltip which listens to theme changes
 */
export const BasicTooltip = ({ id, content }: TooltipProps) => {
  const { isLightMode } = useExpoDesignData();
  return (
    <ReactTooltip
      id={id}
      content={content}
      variant={isLightMode ? "light" : "dark"}
    />
  );
};
