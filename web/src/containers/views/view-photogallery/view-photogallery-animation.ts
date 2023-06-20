import { animationType } from "enums/animation-type";

import { AnimationType } from "models";

export const resolvePhotogalleryAnimation = (type: AnimationType) => {
  return type === animationType.FLY_IN_OUT ||
    type === animationType.FLY_IN_OUT_AND_BLUR_BACKGROUND
    ? {
        from: {
          translateX: "100vw",
          opacity: 0,
        },
        enter: {
          translateX: "0vw",
          opacity: 1,
        },
        leave: {
          translateX: "-100vw",
          opacity: 0,
        },
        config: {
          duration: 1000,
        },
      }
    : type === animationType.FADE_IN_OUT ||
      type === animationType.FADE_IN_OUT_AND_BLUR_BACKGROUND
    ? {
        from: {
          translateX: 0,
          opacity: 0,
        },
        enter: {
          translateX: 0,
          opacity: 1,
        },
        leave: {
          translateX: 0,
          opacity: 0,
        },
        config: {
          duration: 1500,
        },
      }
    : {};
};
