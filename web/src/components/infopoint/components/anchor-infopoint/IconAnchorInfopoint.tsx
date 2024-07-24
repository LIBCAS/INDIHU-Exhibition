import { AnchorInfopointProps } from ".";
import cx from "classnames";

const IconAnchorInfopoint = ({
  id,
  top,
  left,
  infopoint,
  ...otherProps
}: AnchorInfopointProps) => {
  if (!infopoint.iconFile?.fileId) {
    return null;
  }

  return (
    <div
      {...otherProps}
      data-tooltip-id={id}
      className={cx("absolute cursor-pointer z-0", otherProps.className)}
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
      <img
        src={`/api/files/${infopoint.iconFile.fileId}`}
        alt="icon-infopoint"
        className="w-full h-full"
      />
    </div>
  );
};

export default IconAnchorInfopoint;
