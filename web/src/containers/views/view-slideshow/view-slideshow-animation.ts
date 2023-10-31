import { SlideshowScreenAnimationType } from "models";
import { SlideshowScreenAnimationEnum } from "enums/administration-screens";

// - -

export const resolveSlideshowAnimation = (
  type: SlideshowScreenAnimationType
) => {
  return type === SlideshowScreenAnimationEnum.FLY_IN_OUT ||
    type === SlideshowScreenAnimationEnum.FLY_IN_OUT_AND_BLUR_BACKGROUND
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
    : type === SlideshowScreenAnimationEnum.FADE_IN_OUT ||
      type === SlideshowScreenAnimationEnum.FADE_IN_OUT_AND_BLUR_BACKGROUND
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
