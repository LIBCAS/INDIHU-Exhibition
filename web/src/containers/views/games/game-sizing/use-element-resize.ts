import { useMemo } from "react";
import { useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";

import { ImageOrigData, Size } from "models";

type UseElementResizeProps = {
  imageOrigData: ImageOrigData;
  containerSize: Size;
};

export const useElementResize = ({
  imageOrigData,
  containerSize,
}: UseElementResizeProps) => {
  const { width: origImgWidth, height: origImgHeight } = imageOrigData;

  const origImgRatio = useMemo(
    () => origImgWidth / origImgHeight,
    [origImgHeight, origImgWidth]
  );

  const [spring, springApi] = useSpring(() => ({
    width: origImgWidth,
    height: origImgHeight,
  }));

  const bindDrag = useDrag(
    (state) => {
      const { down, offset, lastOffset } = state;
      const [x, y] = offset;
      const [xp, yp] = lastOffset;

      if (!down) {
        return;
      }

      // we double the increments since the container is centered (grows on both sides)
      const width = 2 * x - xp;
      const height = 2 * y - yp;

      const widthBased = width > height * origImgRatio;

      springApi.start({
        width: widthBased ? width : height * origImgRatio,
        height: widthBased ? width / origImgRatio : height,
        immediate: true,
      });
    },
    {
      from: () => [spring.width.get(), spring.height.get()],
      bounds: (state) => {
        const [xp = 0, yp = 0] = state?.lastOffset ?? [];

        const maxWidth = (containerSize.width - 100 + xp) / 2;
        const maxHeight = (containerSize.height - 100 + yp) / 2;

        const widthBased =
          containerSize.width < containerSize.height * origImgRatio;

        return {
          left: (50 + xp) / 2,
          top: (50 + yp) / 2,
          right: widthBased ? maxWidth : maxHeight * origImgRatio,
          bottom: widthBased ? maxWidth / origImgRatio : maxHeight,
        };
      },
    }
  );

  return {
    spring,
    bindDrag,
  };
};
