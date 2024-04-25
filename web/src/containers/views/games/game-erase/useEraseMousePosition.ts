import { calculateObjectFit } from "utils/object-fit";
import { Size } from "models";
import { useMemo } from "react";

const useEraseMousePosition = (
  containerSize: Size,
  imageOrigDataSize: Size,
  mousePosition: { x: number; y: number },
  lineWidth: number
) => {
  // 1. Calculate contained image dimensions
  const {
    width: contImageWidth,
    height: contImageHeight,
    left: fromLeft,
    top: fromTop,
  } = calculateObjectFit({
    parent: containerSize,
    child: imageOrigDataSize,
    type: "contain",
  });

  // 2. Calculate information about current mouse position according to the contained image
  const { isMouseOutsideImg, isMouseNearTheSide, nearSideX, nearSideY } =
    useMemo(() => {
      let isMouseOutsideImg = false;
      let isMouseNearTheSide = false;
      let nearSideX = 0;
      let nearSideY = 0;

      // 1. Check whether the mouse is outside the contained img
      if (
        mousePosition.x <= fromLeft ||
        mousePosition.x >= fromLeft + contImageWidth
      ) {
        isMouseOutsideImg = true;
      }
      if (
        mousePosition.y <= fromTop ||
        mousePosition.y >= fromTop + contImageHeight
      ) {
        isMouseOutsideImg = true;
      }

      // 2. Check whether the mouse is near the side of end of contained img (lineWidth from the sides)
      if (
        mousePosition.x >= fromLeft &&
        mousePosition.x <= fromLeft + lineWidth / 2
      ) {
        isMouseNearTheSide = true;
        nearSideX = mousePosition.x - fromLeft;
      }
      if (
        mousePosition.x >= fromLeft + contImageWidth - lineWidth / 2 &&
        mousePosition.x <= fromLeft + contImageWidth
      ) {
        isMouseNearTheSide = true;
        nearSideX = fromLeft + contImageWidth - mousePosition.x;
      }

      if (
        mousePosition.y >= fromTop &&
        mousePosition.y <= fromTop + lineWidth / 2
      ) {
        isMouseNearTheSide = true;
        nearSideY = mousePosition.y - fromTop;
      }
      if (
        mousePosition.y >= fromTop + contImageHeight - lineWidth / 2 &&
        mousePosition.y <= fromTop + contImageHeight
      ) {
        isMouseNearTheSide = true;
        nearSideY = fromTop + contImageHeight - mousePosition.y;
      }

      return { isMouseOutsideImg, isMouseNearTheSide, nearSideX, nearSideY };
    }, [
      contImageHeight,
      contImageWidth,
      fromLeft,
      fromTop,
      lineWidth,
      mousePosition.x,
      mousePosition.y,
    ]);

  return { isMouseOutsideImg, isMouseNearTheSide, nearSideX, nearSideY };
};

export default useEraseMousePosition;
