import { animationType, animationTypeText } from "enums/animation-type";

export const animationOptions = [
  { label: animationTypeText.HORIZONTAL, value: animationType.HORIZONTAL },
  { label: animationTypeText.VERTICAL, value: animationType.VERTICAL },
  {
    label: animationTypeText.GRADUAL_TRANSITION,
    value: animationType.GRADUAL_TRANSITION,
  },
  {
    label: "Prolnutí",
    value: animationType.FADE_IN_OUT_TWO_IMAGES,
  },
];

export const rodPositionOptions = [
  { label: "Na začátku obrazovky", value: "0" },
  { label: "Ve čtvrtině obrazovky", value: "0.25" },
  { label: "V půlce obrazovky", value: "0.5" },
  { label: "V tričtvrtině obrazovky", value: "0.75" },
  { label: "Na konci obrazovky", value: "1" },
];

export const gradualTransitionBeginPositionOptions = [
  { label: "Vertikální shora dolů", value: "VERTICAL_TOP_TO_BOTTOM" },
  { label: "Vertikální zdola nahoru", value: "VERTICAL_BOTTOM_TO_TOP" },
  { label: "Horizontální zleva doprava", value: "HORIZONTAL_LEFT_TO_RIGHT" },
  { label: "Horizontální zprava doleva", value: "HORIZONTAL_RIGHT_TO_LEFT" },
];

// const transitionOptions = [
//   { label: screenTransitionText.ON_TIME, value: screenTransition.ON_TIME },
//   { label: screenTransitionText.ON_BUTTON, value: screenTransition.ON_BUTTON },
// ];
