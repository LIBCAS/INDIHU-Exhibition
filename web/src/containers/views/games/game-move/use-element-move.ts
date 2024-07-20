import { useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";

import { Position, Size } from "models";

type UseElementMoveProps = {
  containerSize: Size;
  dragMovingObjectSize: Size;
  initialPosition?: Position;
  additionalCallback?: (left: number, top: number) => void;
};

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
