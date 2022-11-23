import { ImageScreen } from "models";

export const getViewImageAnimation = (type: ImageScreen["animationType"]) =>
  type === "FROM_TOP"
    ? {
        from: {
          scale: 1.2,
          translateX: 0,
          // we translate by 0.1 * 100 / 1.2 % because of the scale
          translateY: "8.333%",
        },
        to: {
          translateX: 0,
          translateY: "-8.333%",
        },
      }
    : type === "FROM_BOTTOM"
    ? {
        from: {
          scale: 1.2,
          translateX: 0,
          translateY: "-8.333%",
        },
        to: {
          translateX: 0,
          translateY: "8.333%",
        },
      }
    : type === "FROM_LEFT_TO_RIGHT"
    ? {
        from: {
          scale: 1.2,
          translateY: 0,
          translateX: "8.333%",
        },
        to: {
          translateY: 0,
          translateX: "-8.333%",
        },
      }
    : type === "FROM_RIGHT_TO_LEFT"
    ? {
        from: {
          scale: 1.2,
          translateY: 0,
          translateX: "-8.333%",
        },
        to: {
          translateY: 0,
          translateX: "8.333%",
        },
      }
    : {
        from: {
          scale: 1,
          translateY: 0,
          translateX: 0,
        },
        to: {
          translateY: 0,
          translateX: 0,
        },
      };
