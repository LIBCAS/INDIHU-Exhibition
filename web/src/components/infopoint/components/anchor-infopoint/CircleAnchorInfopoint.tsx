import { useSpring, animated } from "react-spring";
import { AnchorInfopointProps } from ".";
import cx from "classnames";

const CircleAnchorInfopoint = ({
  id, // used as "data-tooltip-id"
  top,
  left,
  infopoint,
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
      data-tooltip-id={id}
      className={cx(
        "absolute border-2 border-solid border-white hover:cursor-pointer z-0",
        otherProps.className
      )}
      style={{
        width: `${infopoint.pxSize ?? 24}px`,
        height: `${infopoint.pxSize ?? 24}px`,
        top: top,
        left: left,
        transform: "translate(-50%, -50%)",
        backgroundColor: infopoint.color,
        borderRadius: "50%",
        ...otherProps.style,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className="absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${infopoint.pxSize ? infopoint.pxSize / 2 : 12}px`,
          height: `${infopoint.pxSize ? infopoint.pxSize / 2 : 12}px`,
          borderRadius: "50%",
        }}
      >
        <animated.div
          className="w-full h-full pointer-events-none"
          style={{
            backgroundColor: "white",
            opacity,
            scale,
          }}
        />
      </div>
    </div>
  );
};

export default CircleAnchorInfopoint;
