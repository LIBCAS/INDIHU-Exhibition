import { useSpring, animated } from "react-spring";
import { AnchorInfopointProps } from ".";
import cx from "classnames";

const SquareAnchorInfopoint = ({
  id, // used as "data-tooltip-id"
  top,
  left,
  infopoint,
  color = "primary",
  ...otherProps
}: AnchorInfopointProps) => {
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
      {...otherProps}
      data-tooltip-id={id}
      className={cx("absolute z-0", otherProps.className)}
      style={{
        width: `${infopoint.pxSize ?? 24}px`,
        height: `${infopoint.pxSize ?? 24}px`,
        top: top,
        left: left,
        transform: "translate(-50%, -50%)",
        ...otherProps.style,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <animated.div
        className="absolute h-full w-full bg-white pointer-events-none"
        style={{ opacity, scale }}
      />

      <div
        className={cx(
          otherProps.className,
          "absolute w-full h-full border-2 border-white hover:cursor-pointer",
          color === "primary" && "bg-primary"
        )}
        // Overwrite previous colors + backward compatibility
        style={{ backgroundColor: infopoint?.color ?? undefined }}
      />
    </div>
  );
};

export default SquareAnchorInfopoint;
