import { useMemo } from "react";
import { UseSpringProps } from "react-spring";

import { animationType } from "enums/animation-type";

type AnimationType = typeof animationType[keyof typeof animationType];

const baseProps: UseSpringProps = {
  delay: 500,
  config: {
    duration: 1000,
  },
};

export const useViewStartAnimation = (
  animationType?: AnimationType
): UseSpringProps => {
  const animationProps = useMemo(
    () =>
      animationType === "FROM_TOP"
        ? {
            from: {
              transform: "translateY(-100%)",
            },
            to: {
              transform: "translateY(0)",
            },
            ...baseProps,
          }
        : animationType === "FROM_BOTTOM"
        ? {
            from: {
              transform: "translateY(100%)",
            },
            to: {
              transform: "translateY(0)",
            },
            ...baseProps,
          }
        : animationType === "FROM_LEFT_TO_RIGHT"
        ? {
            from: {
              transform: "translateX(-100%)",
            },
            to: {
              transform: "translateX(0)",
            },
            ...baseProps,
          }
        : animationType === "FROM_RIGHT_TO_LEFT"
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
