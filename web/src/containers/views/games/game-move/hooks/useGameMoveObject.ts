import { useCallback, useMemo } from "react";

// Hooks
import { useElementMove } from "hooks/spring-hooks/use-element-move";

// Types
import { GameMoveScreen, Size } from "models";

// Utils
import { calculateObjectInitialPosition, calculateObjectSize } from "../utils";

// - - - - - -

const DEFAULT_POSITION = { left: 0, top: 0 };
const DEFAULT_SIZE = { width: 0, height: 0 };

// - - - - - -

type Props = {
  assignmentImageOrigData: GameMoveScreen["image1OrigData"];
  containerSize: Size;

  objectPositionProps: GameMoveScreen["objectPositionProps"];
  objectSizeProps: GameMoveScreen["objectSizeProps"];
  objectImageOrigData: GameMoveScreen["objectOrigData"];
  objectDragSize: Size;
};

export const useGameMoveObject = ({
  assignmentImageOrigData,
  containerSize,
  objectPositionProps,
  objectSizeProps,
  objectImageOrigData,
  objectDragSize,
}: Props) => {
  // NOTE: Original size of the assignment image, from the administration, e.g. 450px x 350px
  const assignmentImgOrigData = assignmentImageOrigData ?? DEFAULT_SIZE;

  // NOTE: Object's original position, from administration, against the preview contained image
  const objectOrigPosition =
    objectPositionProps?.containedImgPosition ?? DEFAULT_POSITION;

  // NOTE: Object's original size, from the administration
  const objectImgOrigData = objectImageOrigData ?? DEFAULT_SIZE;

  // - - - Move functionality - - -

  const { objInitialLeft, objInitialTop } = useMemo(
    () =>
      calculateObjectInitialPosition(
        assignmentImgOrigData,
        objectOrigPosition,
        containerSize
      ),
    [assignmentImgOrigData, objectOrigPosition, containerSize]
  );

  const { moveSpring, moveSpringApi, bindMoveDrag } = useElementMove({
    containerSize: containerSize,
    dragMovingObjectSize: objectDragSize,
    initialPosition: { left: objInitialLeft, top: objInitialTop },
  });

  // - - - Size calculation of object - - -

  const { objectWidth, objectHeight } = useMemo(
    () =>
      calculateObjectSize(
        assignmentImgOrigData,
        objectImgOrigData,
        objectSizeProps?.inContainedImgFractionSize,
        containerSize
      ),
    [
      assignmentImgOrigData,
      objectImgOrigData,
      objectSizeProps?.inContainedImgFractionSize,
      containerSize,
    ]
  );

  // - - - Reset callbacks - - -

  const resetObjectPosition = useCallback(() => {
    moveSpringApi.start({ left: objInitialLeft, top: objInitialTop });
  }, [moveSpringApi, objInitialLeft, objInitialTop]);

  // - - - Return Value - - -

  return {
    moveSpring,
    bindMoveDrag,
    objectWidth,
    objectHeight,
    resetObjectPosition,
  };
};
