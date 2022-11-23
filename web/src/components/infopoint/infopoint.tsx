import cx from "classnames";

import { animated, useSpring } from "react-spring";

type InfopointProps = {
  color?: "primary";
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Infopoint = ({ color = "primary", ...props }: InfopointProps) => {
  const { opacity, scale } = useSpring({
    from: { opacity: 1, scale: 1 },
    to: { opacity: 0, scale: 1.75 },
    loop: true,
    config: {
      friction: 50,
    },
  });

  return (
    <div {...props} className="relative h-6 w-6">
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
