import { CSSProperties } from "react";
import { useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";

import { Position, Size } from "models";

type UseElementMoveProps = {
  containerSize: Size;
  dragMovingObjectSize: Size;
  initialPosition?: Position;
  additionalCallback?: (left: number, top: number) => void;
};

/**
 * This hook enables an element (e.g. image) to be moved within a defined container boundary.
 * Moving object should be positioned 'absolute', while its container should be positioned 'relative'.
 * NOTE: Add `draggable={false}` html property to the element being moved
 *
 * @param containerSize size of the container which acts as a boundary when moving our element
 * @param dragMovingObjectSize size of the object which is being moved
 * @param initialPosition position of moved object inside container boundary, defaults [0, 0]
 * @param additionalCallback function which is called when new left and top position is being assigned
 */
export const useElementMove = ({
  containerSize,
  dragMovingObjectSize,
  initialPosition,
  additionalCallback,
}: UseElementMoveProps) => {
  // Initial position of image being dragged
  // It will be also reset back to [0, 0] whenever the container size changes (because of the deps array)
  const [moveSpring, moveSpringApi] = useSpring(
    () => ({
      left: initialPosition?.left ?? 0,
      top: initialPosition?.top ?? 0,
    }),
    [containerSize.width, containerSize.height]
  );

  const bindMoveDrag = useDrag(
    ({ down, offset: [x, y] }) => {
      if (!down) {
        return;
      }

      moveSpringApi.start({ left: x, top: y, immediate: true });
      additionalCallback?.(x, y);
    },
    {
      from: () => [moveSpring.left.get(), moveSpring.top.get()],
      bounds: {
        left: 0,
        top: 0,
        right: containerSize.width - dragMovingObjectSize.width,
        bottom: containerSize.height - dragMovingObjectSize.height,
      },
    }
  );

  return { moveSpring, moveSpringApi, bindMoveDrag };
};

export const moveContainerStyle: CSSProperties = {
  position: "relative",
};

// NOTE: also add 'hover:cursor-move'
export const dragMovingObjectStyle: CSSProperties = {
  position: "absolute",
  touchAction: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
};
