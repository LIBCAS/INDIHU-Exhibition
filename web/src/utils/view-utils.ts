import { gameScreens } from "enums/screen-type";
import { Screen, Document } from "models";

export const isGameScreen = (type?: Screen["type"]) =>
  !!gameScreens.find((screenType) => screenType === type);

// - - - - -

export const isWorksheetFile = (file: Document) => {
  if ("documentFileType" in file && file.documentFileType === "worksheet") {
    return true;
  }
  return false;
};

// - - -

type TooltipPlacement = "top" | "right" | "left" | "bottom";

export const getTooltipArrowBorderClassName = ({
  isLightMode,
  placement,
}: {
  isLightMode: boolean;
  placement?: TooltipPlacement;
}): string => {
  if (!placement) {
    return "";
  }

  if (placement === "top" && isLightMode) {
    return "border-b-solid border-b-[1px] border-b-black border-r-solid border-r-[1px] border-r-black";
  }
  if (placement === "top" && !isLightMode) {
    return "border-b-solid border-b-[1px] border-b-white border-r-solid border-r-[1px] border-r-white";
  }

  if (placement === "left" && isLightMode) {
    return "border-t-solid border-t-[1px] border-t-black border-r-solid border-r-[1px] border-r-black";
  }
  if (placement === "left" && !isLightMode) {
    return "border-t-solid border-t-[1px] border-t-white border-r-solid border-r-[1px] border-r-white";
  }

  if (placement === "bottom" && isLightMode) {
    return "border-t-solid border-t-[1px] border-t-black border-l-solid border-l-[1px] border-l-black";
  }
  if (placement === "bottom" && !isLightMode) {
    return "border-t-solid border-t-[1px] border-t-white border-l-solid border-l-[1px] border-l-white";
  }

  if (placement === "right" && isLightMode) {
    return "border-b-solid border-b-[1px] border-b-black border-l-solid border-l-[1px] border-l-black";
  }
  if (placement === "right" && !isLightMode) {
    return "border-b-solid border-b-[1px] border-b-white border-l-solid border-l-[1px] border-l-white";
  }

  return "";
};

// - - -

export const getHaloEffectStyle = (
  shadowColor: "black" | "white",
  variant: 1 | 2 = 1
) => {
  if (variant === 1) {
    return {
      textShadow: `2px 2px 4px ${shadowColor}, -2px -2px 4px ${shadowColor}`,
    };
  }

  if (variant === 2) {
    return {
      textShadow: `-1px 0 ${shadowColor}, 0 1px ${shadowColor}, 1px 0 ${shadowColor}, 0 -1px ${shadowColor}`,
    };
  }
};
