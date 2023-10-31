import { useMemo } from "react";
import { UseSpringProps } from "react-spring";

import { ScreenStartAnimationEnum } from "enums/administration-screens";
import { ScreenStartAnimationType } from "models";

const baseProps: UseSpringProps = {
  delay: 500,
  config: {
    duration: 1000,
  },
};

// - -

export const useViewStartAnimation = (
  animationType?: ScreenStartAnimationType
): UseSpringProps => {
  const animationProps = useMemo(
    () =>
      animationType === ScreenStartAnimationEnum.FROM_TOP
        ? {
            from: {
              transform: "translateY(-100%)",
            },
            to: {
              transform: "translateY(0)",
            },
            ...baseProps,
          }
        : animationType === ScreenStartAnimationEnum.FROM_BOTTOM
        ? {
            from: {
              transform: "translateY(100%)",
            },
            to: {
              transform: "translateY(0)",
            },
            ...baseProps,
          }
        : animationType === ScreenStartAnimationEnum.FROM_LEFT_TO_RIGHT
        ? {
            from: {
              transform: "translateX(-100%)",
            },
            to: {
              transform: "translateX(0)",
            },
            ...baseProps,
          }
        : animationType === ScreenStartAnimationEnum.FROM_RIGHT_TO_LEFT
        ? {
            from: {
              transform: "translateX(100%)",
            },
            to: {
              transform: "translateX(0)",
            },
            ...baseProps,
          }
        : {},
    [animationType]
  );

  return animationProps;
};
