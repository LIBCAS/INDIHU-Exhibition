import { DetailedHTMLProps, HTMLAttributes } from "react";
import { animated, useSpring } from "react-spring";
import cx from "classnames";

interface BasicSquareInfopointProps {
  id: string; // used as "data-tooltip-id"
  content: string; // used as "data-tooltip-content"
  top: number;
  left: number;
  color?: "primary";
}

type SquareInfopointProps = BasicSquareInfopointProps &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const SquareInfopoint = ({
  top,
  left,
  id,
  content,
  color = "primary",
  ...props
}: SquareInfopointProps) => {
  // Animation
  const { opacity, scale } = useSpring({
    from: { opacity: 1, scale: 1 },
    to: { opacity: 0, scale: 1.75 },
    loop: true,
    config: {
      friction: 50,
    },
  });

  return (
    <div
      {...props}
      data-tooltip-id={id}
      data-tooltip-content={content}
      className={`relative h-6 w-6 ${props.className}`}
      style={{ top: top, left: left, ...props.style }}
    >
      <animated.div
        className="absolute h-full w-full bg-white pointer-events-none"
        style={{ opacity, scale }}
      />

      <div
        className={cx(
          props.className,
          "absolute w-full h-full border-2 border-white hover:cursor-pointer",
          color === "primary" && "bg-primary"
        )}
      />
    </div>
  );
};

export default SquareInfopoint;
