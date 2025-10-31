import { Position, Size } from "models";
import { calculateObjectFit } from "utils/object-fit";

// - - - - - -

/**
 *
 */
export const calculateObjectInitialPosition = (
  assignmentImgOriginalData: Size | undefined | null,
  objectOriginalPosition: Position | undefined | null,
  containerSize: Size
) => {
  const assignmentImgOrigData = assignmentImgOriginalData ?? {
    width: 0,
    height: 0,
  };

  // NOTE: Object's original position, from administration, against the preview contained image
  const objectPosition = objectOriginalPosition ?? {
    left: 0,
    top: 0,
  };

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
  const wFraction = objectPosition.left / assignmentImgOrigData.width;
  const hFraction = objectPosition.top / assignmentImgOrigData.height;

  const objInitialLeft = assignmentImgLeftEdge + wFraction * assignmentImgWidth;
  const objInitialTop = assignmentImgTopEdge + hFraction * assignmentImgHeight;

  return { objInitialLeft, objInitialTop };
};

/**
 *
 */
export const calculateObjectSize = (
  assignmentImgOriginalData: Size | undefined | null,
  objectImgOriginalData: Size | undefined | null,
  objectOriginalSize: Size | undefined | null,
  containerSize: Size
) => {
  const assignmentImgOrigData = assignmentImgOriginalData ?? {
    width: 0,
    height: 0,
  };

  const { width: assignmentImgWidth, height: assignmentImgHeight } =
    calculateObjectFit({
      type: "contain",
      parent: containerSize,
      child: assignmentImgOrigData,
    });

  const objectImgOrigData = objectImgOriginalData ?? {
    width: 0,
    height: 0,
  };

  if (objectOriginalSize === undefined || objectOriginalSize === null) {
    return {
      objectWidth: objectImgOrigData.width,
      objectHeight: objectImgOrigData.height,
    };
  }

  const objectWidth = objectOriginalSize.width * assignmentImgWidth;
  const objectHeight = objectOriginalSize.height * assignmentImgHeight;

  return { objectWidth, objectHeight };
};
