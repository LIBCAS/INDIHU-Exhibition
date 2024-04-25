import { CSSProperties } from "react";
import { useSpring, animated } from "react-spring";
import cx from "classnames";

type SpinnerProps = {
  scale?: 1 | 2 | 3 | 4;
  className?: string;
  style?: CSSProperties;
};

export const Spinner = ({ scale = 1, className, style }: SpinnerProps) => {
  const { rotate } = useSpring({
    from: {
      rotate: 0,
    },
    to: {
      rotate: 360,
    },
    loop: true,
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  });

  return (
    <animated.div
      className={cx(
        "h-14 w-14 border-4 border-x-primary border-t-primary border-b-transparent rounded-full",
        className
      )}
      style={{ transform: `scale(${scale})`, rotate, ...style }}
    />
  );
};
