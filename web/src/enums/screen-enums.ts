/**
 * Position of tooltip in ZoomIn screen
 */
export const zoomInTooltipPosition = {
  TOP_LEFT: "TOP_LEFT",
  TOP_RIGHT: "TOP_RIGHT",
} as const;

export const zoomInTooltipPositionText = {
  TOP_LEFT: "Vlevo nahoře",
  TOP_RIGHT: "Vpravo nahoře",
};

/**
 * Switch to next screen on time expired or button click
 */
export const screenTransition = {
  ON_TIME: "ON_TIME",
  ON_BUTTON: "ON_BUTTON",
};

export const screenTransitionText = {
  ON_TIME: "Po uplynutí času",
  ON_BUTTON: "Tlačítko pro přesun",
};

export const verticalPosition = {
  TOP: "TOP",
  CENTER: "CENTER",
  BOTTOM: "BOTTOM",
} as const;

export const horizontalPosition = {
  LEFT: "LEFT",
  CENTER: "CENTER",
  RIGHT: "RIGHT",
} as const;
