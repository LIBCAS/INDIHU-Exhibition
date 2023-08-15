import { DetailedHTMLProps, HTMLAttributes } from "react";
import { animated, useSpring } from "react-spring";
import cx from "classnames";
import { Infopoint } from "models";

// - - - - - - - -

type BaseProps = {
  id: string; // used as "data-tooltip-id"
  top: number;
  left: number;
  infopoint: Infopoint;
  color?: "primary"; // backward compatibility
};

type ScreenAnchorInfopointProps = BaseProps &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const ScreenAnchorInfopoint = (props: ScreenAnchorInfopointProps) => {
  if (props.infopoint?.shape === "CIRCLE") {
    return <CircleAnchorInfopoint {...props} />;
  }
  if (props.infopoint?.shape === "ICON") {
    return <IconAnchorInfopoint {...props} />;
  }
  return <SquareAnchorInfopoint {...props} />;
};

// - - - - - - - -

const CircleAnchorInfopoint = ({
  id, // used as "data-tooltip-id"
  top,
  left,
  infopoint,
  ...otherProps
}: ScreenAnchorInfopointProps) => {
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
        "absolute border-2 border-solid border-white hover:cursor-pointer",
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

// - - - - - - - -

const IconAnchorInfopoint = ({
  id,
  top,
  left,
  infopoint,
  ...otherProps
}: ScreenAnchorInfopointProps) => {
  if (!infopoint.iconFile?.fileId) {
    return null;
  }

  return (
    <div
      {...otherProps}
      data-tooltip-id={id}
      className={cx("absolute cursor-pointer", otherProps.className)}
      style={{
        width: `${infopoint.pxSize ?? 24}px`,
        height: `${infopoint.pxSize ?? 24}px`,
        top: top,
        left: left,
        transform: "translate(-50%, -50%)",
        ...otherProps.style,
      }}
    >
      <img
        src={`/api/files/${infopoint.iconFile.fileId}`}
        alt="icon-infopoint"
        className="w-full h-full"
      />
    </div>
  );
};

// - - - - - - - -

const SquareAnchorInfopoint = ({
  id, // used as "data-tooltip-id"
  top,
  left,
  infopoint,
  color = "primary",
  ...otherProps
}: ScreenAnchorInfopointProps) => {
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
      className={cx("absolute", otherProps.className)}
      style={{
        width: `${infopoint.pxSize ?? 24}px`,
        height: `${infopoint.pxSize ?? 24}px`,
        top: top,
        left: left,
        transform: "translate(-50%, -50%)",
        ...otherProps.style,
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

// - - - - - - - -

export default ScreenAnchorInfopoint;
