import { GameMoveScreen, Size } from "models";
import { calculateObjectFit } from "utils/object-fit";

export const calculateObjectInitialPosition = (
  viewScreen: GameMoveScreen,
  containerSize: Size
) => {
  const assignmentImgOrigData = viewScreen.image1OrigData ?? {
    width: 0,
    height: 0,
  };

  // Object position from administration against the contained image there
  const objectPosition = viewScreen.objectPositionProps
    ?.containedImgPosition ?? {
    left: 0,
    top: 0,
  };

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
