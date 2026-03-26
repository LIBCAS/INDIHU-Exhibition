import { PlacesType } from "react-tooltip";
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

export const getTooltipArrowBorderClassName = ({
  isLightMode,
  placement,
}: {
  isLightMode: boolean;
  placement?: PlacesType;
}): string => {
  if (!placement) {
    return "";
  }

  const isTopPlacement =
    placement === "top" || placement === "top-start" || placement === "top-end";
  const isLeftPlacement =
    placement === "left" ||
    placement === "left-start" ||
    placement === "left-end";
  const isBottomPlacement =
    placement === "bottom" ||
    placement === "bottom-start" ||
    placement === "bottom-end";
  const isRightPlacement =
    placement === "right" ||
    placement === "right-start" ||
    placement === "right-end";

  if (isTopPlacement && isLightMode) {
    return "border-b-solid border-b-[1px] border-b-black border-r-solid border-r-[1px] border-r-black";
  }
  if (isTopPlacement && !isLightMode) {
    return "border-b-solid border-b-[1px] border-b-white border-r-solid border-r-[1px] border-r-white";
  }

  if (isLeftPlacement && isLightMode) {
    return "border-t-solid border-t-[1px] border-t-black border-r-solid border-r-[1px] border-r-black";
  }
  if (isLeftPlacement && !isLightMode) {
    return "border-t-solid border-t-[1px] border-t-white border-r-solid border-r-[1px] border-r-white";
  }

  if (isBottomPlacement && isLightMode) {
    return "border-t-solid border-t-[1px] border-t-black border-l-solid border-l-[1px] border-l-black";
  }
  if (isBottomPlacement && !isLightMode) {
    return "border-t-solid border-t-[1px] border-t-white border-l-solid border-l-[1px] border-l-white";
  }

  if (isRightPlacement && isLightMode) {
    return "border-b-solid border-b-[1px] border-b-black border-l-solid border-l-[1px] border-l-black";
  }
  if (isRightPlacement && !isLightMode) {
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
