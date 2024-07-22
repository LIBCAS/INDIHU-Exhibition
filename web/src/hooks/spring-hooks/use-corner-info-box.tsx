import { useMemo, CSSProperties } from "react";
import { useTransition, animated } from "react-spring";
import cx from "classnames";

type UseCornerInfoBoxProps<T> = {
  items: T[] | undefined;
  currIndex: number;
  textExtractor: (item: T) => string;
  position: "left" | "right"; // upper-left or upper-right
  className?: string;
  style?: CSSProperties;
};

export const useCornerInfoBox = <T,>({
  items,
  currIndex,
  textExtractor,
  position,
  className,
  style,
}: UseCornerInfoBoxProps<T>) => {
  const currItem = useMemo(() => items?.[currIndex], [currIndex, items]);

  const infoBoxStyle = useMemo<CSSProperties>(() => {
    if (position === "left") {
      return { left: 20, top: 20 };
    }

    return { right: 20, top: 20 };
  }, [position]);

  const itemsInfoTransition = useTransition(currItem, {
    from: { opacity: 0, translateX: position === "right" ? 15 : -15 },
    enter: { opacity: 1, translateX: 0, delay: 250 },
    leave: { opacity: 0, translateX: position === "right" ? 15 : -15 },
  });

  const Element = itemsInfoTransition(
    ({ opacity, translateX }, item) =>
      item && (
        <animated.div
          className={cx(
            "fixed p-4 shadow-md text-black bg-white max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] overflow-x-hidden text-ellipsis",
            className
          )}
          style={{ opacity, translateX, ...infoBoxStyle, ...style }}
        >
          {textExtractor(item)}
        </animated.div>
      )
  );

  return Element;
};
