import { useMemo } from "react";
import cx from "classnames";

import { clamp } from "lodash";
import { animated, useSpring } from "react-spring";

type Props = {
  height?: number;
  color?: "white" | "primary";
  percentage: number;
};

export const ProgressBar = ({
  height = 10,
  color = "primary",
  percentage,
}: Props) => {
  const clampedPercentage = useMemo(
    () => clamp(percentage, 0, 100),
    [percentage]
  );

  const style = useSpring({
    width: `${clampedPercentage}%`,
    config: { duration: 500 },
  });

  return (
    <div style={{ minHeight: height }} className="w-full bg-muted-200">
      <animated.div
        style={{ ...style, minHeight: height }}
        className={cx(
          "h-full",
          color === "primary" && "bg-primary",
          color === "white" && "bg-white"
        )}
      />
    </div>
  );
};
