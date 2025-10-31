import { Position, Size } from "models";
import { calculateObjectFit } from "utils/object-fit";

// - - - - - -

/**
 *
 */
export const calculateObjectInitialPosition = (
  assignmentImgOrigData: Size,
  objectOrigPosition: Position,
  containerSize: Size
) => {
  // NOTE: We have image original data (administration) and containerSize (view)
  // So, we can calculate the size of the contained assignment image inside view
  const {
    width: assignmentImgWidth,
    height: assignmentImgHeight,
    left: assignmentImgLeftEdge,
    top: assignmentImgTopEdge,
  } = calculateObjectFit({
    type: "contain",
    parent: containerSize,
    child: assignmentImgOrigData,
  });

  // E.g. wFraction = 0.25 means that the object's left-top corner is located 25% left against contained img there
  const wFraction = objectOrigPosition.left / assignmentImgOrigData.width;
  const hFraction = objectOrigPosition.top / assignmentImgOrigData.height;

  const objInitialLeft = assignmentImgLeftEdge + wFraction * assignmentImgWidth;
  const objInitialTop = assignmentImgTopEdge + hFraction * assignmentImgHeight;

  return { objInitialLeft, objInitialTop };
};

/**
 *
 */
export const calculateObjectSize = (
  assignmentImgOrigData: Size,
  objectImgOrigData: Size,
  objectOriginalSize: Size | undefined | null,
  containerSize: Size
) => {
  if (objectOriginalSize === undefined || objectOriginalSize === null) {
    return {
      objectWidth: objectImgOrigData.width,
      objectHeight: objectImgOrigData.height,
    };
  }

  const { width: assignmentImgWidth, height: assignmentImgHeight } =
    calculateObjectFit({
      type: "contain",
      parent: containerSize,
      child: assignmentImgOrigData,
    });

  const objectWidth = objectOriginalSize.width * assignmentImgWidth;
  const objectHeight = objectOriginalSize.height * assignmentImgHeight;

  return { objectWidth, objectHeight };
};
