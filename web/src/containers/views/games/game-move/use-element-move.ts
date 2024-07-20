import { useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";

import { Position, Size } from "models";

type UseElementMoveProps = {
  containerSize: Size;
  draggingObjectSize: Size;
  initialPosition?: Position;
  additionalCallback?: (left: number, top: number) => void;
};

export const useElementMove = ({
  containerSize,
  draggingObjectSize,
  initialPosition,
  additionalCallback,
}: UseElementMoveProps) => {
  // Initial position of image being dragged
  // It will be also reset back to [0, 0] whenever the container size changes (because of the deps array)
  const [dragSpring, dragApi] = useSpring(
    () => ({
      left: initialPosition?.left ?? 0,
      top: initialPosition?.top ?? 0,
    }),
    [containerSize.width, containerSize.height]
  );

  const bindDrag = useDrag(
    ({ down, offset: [x, y] }) => {
      if (!down) {
        return;
      }

      dragApi.start({ left: x, top: y, immediate: true });
      additionalCallback?.(x, y);
    },
    {
      from: () => [dragSpring.left.get(), dragSpring.top.get()],
      bounds: {
        left: 0,
        top: 0,
        right: containerSize.width - draggingObjectSize.width,
        bottom: containerSize.height - draggingObjectSize.height,
      },
    }
  );

  return {
    dragSpring,
    dragApi,
    bindDrag,
  };
};
