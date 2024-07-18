import { PlacesType } from "react-tooltip";

export type BasicTooltipProps = {
  id: string;
  content: string;
  variant?: "light" | "dark";
  place?: PlacesType;
  className?: string;
};
