export const animationType = {
  WITHOUT: "WITHOUT",
  WITHOUT_FULL_SCREEN: "WITHOUT_FULL_SCREEN",
  WITHOUT_NO_CROP: "WITHOUT_NO_CROP",
  FROM_TOP: "FROM_TOP",
  FROM_BOTTOM: "FROM_BOTTOM",
  FROM_LEFT_TO_RIGHT: "FROM_LEFT_TO_RIGHT",
  FROM_RIGHT_TO_LEFT: "FROM_RIGHT_TO_LEFT",
  FADE_IN_OUT: "FADE_IN_OUT",
  FADE_IN_OUT_TWO_IMAGES: "FADE_IN_OUT_TWO_IMAGES",
  FADE_IN: "FADE_IN",
  FADE_OUT: "FADE_OUT",
  FLY_IN_OUT: "FLY_IN_OUT",
  FLY_IN: "FLY_IN",
  FLY_OUT: "FLY_OUT",
  HOVER: "HOVER",
  CLICK: "CLICK",
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL"
};

export const animationTypeText = {
  WITHOUT: "Bez animace",
  WITHOUT_FULL_SCREEN: "Bez animace a na celou obrazovku",
  WITHOUT_NO_CROP: "Bez animace a bez ořezání obrázku",
  FROM_TOP: "Shora dolů",
  FROM_BOTTOM: "Zdola nahoru",
  FROM_LEFT_TO_RIGHT: "Zleva doprava",
  FROM_RIGHT_TO_LEFT: "Zprava doleva",
  FADE_IN_OUT: "Pozvolné objevení",
  FADE_IN_OUT_TWO_IMAGES: "Pozvolný přechod",
  FLY_IN_OUT: "Zleva doprava",
  HOVER: "Myš nad obrázkem",
  CLICK: "Kliknutí na obrázek",
  HORIZONTAL: "Horizontální táhlo",
  VERTICAL: "Vertikální táhlo"
};

export const animationTypeViewStartEnum = [
  { value: animationType.WITHOUT, label: animationTypeText.WITHOUT },
  { value: animationType.FROM_TOP, label: animationTypeText.FROM_TOP },
  { value: animationType.FROM_BOTTOM, label: animationTypeText.FROM_BOTTOM },
  {
    label: animationTypeText.FROM_LEFT_TO_RIGHT,
    value: animationType.FROM_LEFT_TO_RIGHT
  },
  {
    label: animationTypeText.FROM_RIGHT_TO_LEFT,
    value: animationType.FROM_RIGHT_TO_LEFT
  }
];
