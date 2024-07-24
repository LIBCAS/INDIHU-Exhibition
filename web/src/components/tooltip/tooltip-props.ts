import { CSSProperties } from "react";
import { PlacesType } from "react-tooltip";

export type BasicTooltipProps = {
  id: string;
  content: string;
  variant?: "light" | "dark";
  place?: PlacesType;
  className?: string;
  style?: CSSProperties;
};
