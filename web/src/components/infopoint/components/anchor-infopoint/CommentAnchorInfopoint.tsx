import { AnchorInfopointProps } from ".";
import cx from "classnames";
import { palette } from "palette";

// - - - - - -

const CommentAnchorInfopoint = ({
  id,
  left,
  top,
  infopoint,
  ...otherProps
}: AnchorInfopointProps) => {
  const size = infopoint.pxSize ?? 24;
  const color = infopoint.color ?? palette.primary;

  return (
    <div
      {...otherProps}
      data-tooltip-id={id}
      className={cx("absolute cursor-pointer z-0", otherProps.className)}
      style={{
        width: size,
        height: size,
        left: left,
        top: top,
        transform: "translate(-50%, -50%)",
        ...otherProps.style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ backgroundColor: undefined }}
      >
        <path
          d="M1.5,5.3v9.54a3.82,3.82,0,0,0,3.82,3.82H7.23v2.86L13,18.66h5.73a3.82,3.82,0,0,0,3.82-3.82V5.3a3.82,3.82,0,0,0-3.82-3.82H5.32A3.82,3.82,0,0,0,1.5,5.3Z"
          fill="none"
          stroke={color}
          strokeWidth="1.91"
          strokeMiterlimit="10"
        />
        <line
          x1="15.82"
          y1="10.07"
          x2="17.73"
          y2="10.07"
          stroke={color}
          strokeWidth="1.91"
        />
        <line
          x1="11.05"
          y1="10.07"
          x2="12.95"
          y2="10.07"
          stroke={color}
          strokeWidth="1.91"
        />
        <line
          x1="6.27"
          y1="10.07"
          x2="8.18"
          y2="10.07"
          stroke={color}
          strokeWidth="1.91"
        />
      </svg>
    </div>
  );
};

export default CommentAnchorInfopoint;
