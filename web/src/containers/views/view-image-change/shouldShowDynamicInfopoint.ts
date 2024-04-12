import { ImageChangeScreen, Position } from "models";

// Dynamic infopoints feature on View-Image screen
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
