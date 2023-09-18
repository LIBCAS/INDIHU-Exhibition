import { gameScreens } from "enums/screen-type";
import { Screen, Document, ImageChangeScreen } from "models";

export const isGameScreen = (type?: Screen["type"]) =>
  !!gameScreens.find((screenType) => screenType === type);

export const isStartOrFinishScreen = (type: Screen["type"]) => {
  return type === "START" || type === "FINISH";
};

// - - -

export const parseUrlSection = (
  section: string
): number | "start" | "finish" | undefined => {
  if (section === "start" || section === "finish") {
    return section;
  }

  const parsedSection = parseInt(section);
  if (isNaN(parsedSection)) {
    return undefined;
  }

  return parsedSection;
};

export const parseUrlScreen = (screen: string): number | undefined => {
  const parsedScreen = parseInt(screen);
  return isNaN(parsedScreen) ? undefined : parsedScreen;
};

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

// - - -

// Dynamic infopoints feature on View-Image screen
type Position = {
  left: number;
  top: number;
};

type ShowDynamicInfopointArgs = {
  infopointPosition: Position;
  currentRodPosition: Position;
  currOpacity: number;
  animationType: ImageChangeScreen["animationType"];
  gradualPosition: ImageChangeScreen["gradualTransitionBeginPosition"];
};

export const shouldShowBeforeImageInfopoint = ({
  infopointPosition,
  currentRodPosition,
  currOpacity,
  animationType,
  gradualPosition,
}: ShowDynamicInfopointArgs) => {
  if (
    animationType === "HORIZONTAL" &&
    currentRodPosition.top < infopointPosition.top
  ) {
    return false;
  }

  if (
    animationType === "VERTICAL" &&
    currentRodPosition.left < infopointPosition.left
  ) {
    return false;
  }

  if (
    animationType === "GRADUAL_TRANSITION" &&
    (gradualPosition === "VERTICAL_TOP_TO_BOTTOM" ||
      gradualPosition === undefined) &&
    currentRodPosition.top < infopointPosition.top
  ) {
    return false;
  }

  if (
    animationType === "GRADUAL_TRANSITION" &&
    gradualPosition === "VERTICAL_BOTTOM_TO_TOP" &&
    currentRodPosition.top < infopointPosition.top
  ) {
    return false;
  }

  if (
    animationType === "GRADUAL_TRANSITION" &&
    gradualPosition === "HORIZONTAL_LEFT_TO_RIGHT" &&
    currentRodPosition.left < infopointPosition.left
  ) {
    return false;
  }

  if (
    animationType === "GRADUAL_TRANSITION" &&
    gradualPosition === "HORIZONTAL_RIGHT_TO_LEFT" &&
    currentRodPosition.left < infopointPosition.left
  ) {
    return false;
  }

  if (animationType === "FADE_IN_OUT_TWO_IMAGES" && currOpacity < 0.75) {
    return false;
  }

  return true;
};

// - -

export const shouldShowAfterImageInfopoint = ({
  infopointPosition,
  currentRodPosition,
  currOpacity,
  animationType,
  gradualPosition,
}: ShowDynamicInfopointArgs) => {
  if (
    animationType === "HORIZONTAL" &&
    currentRodPosition.top > infopointPosition.top
  ) {
    return false;
  }

  if (
    animationType === "VERTICAL" &&
    currentRodPosition.left > infopointPosition.left
  ) {
    return false;
  }

  if (
    animationType === "GRADUAL_TRANSITION" &&
    (gradualPosition === "VERTICAL_TOP_TO_BOTTOM" ||
      gradualPosition === undefined) &&
    currentRodPosition.top > infopointPosition.top
  ) {
    return false;
  }

  if (
    animationType === "GRADUAL_TRANSITION" &&
    gradualPosition === "VERTICAL_BOTTOM_TO_TOP" &&
    currentRodPosition.top > infopointPosition.top
  ) {
    return false;
  }

  if (
    animationType === "GRADUAL_TRANSITION" &&
    gradualPosition === "HORIZONTAL_LEFT_TO_RIGHT" &&
    currentRodPosition.left > infopointPosition.left
  ) {
    return false;
  }

  if (
    animationType === "GRADUAL_TRANSITION" &&
    gradualPosition === "HORIZONTAL_RIGHT_TO_LEFT" &&
    currentRodPosition.left > infopointPosition.left
  ) {
    return false;
  }

  if (animationType === "FADE_IN_OUT_TWO_IMAGES" && currOpacity > 0.25) {
    return false;
  }

  return true;
};
