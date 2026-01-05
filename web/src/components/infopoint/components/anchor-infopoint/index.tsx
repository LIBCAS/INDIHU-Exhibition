import { DetailedHTMLProps, HTMLAttributes } from "react";

// Components
import SquareAnchorInfopoint from "./SquareAnchorInfopoint";
import IconAnchorInfopoint from "./IconAnchorInfopoint";
import CircleAnchorInfopoint from "./CircleAnchorInfopoint";
import CommentAnchorInfopoint from "./CommentAnchorInfopoint";

// Models
import { Infopoint } from "models";

// - - - - - - - -

type BaseProps = {
  id: string; // used as "data-tooltip-id"
  top: number;
  left: number;
  infopoint: Infopoint;
  color?: "primary"; // backward compatibility
  isComment?: boolean;
};

export type AnchorInfopointProps = BaseProps &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const AnchorInfopoint = (props: AnchorInfopointProps) => {
  const { isComment, ...otherProps } = { ...props };

  if (isComment) {
    return <CommentAnchorInfopoint {...otherProps} />;
  }

  if (props.infopoint.shape === "CIRCLE") {
    return <CircleAnchorInfopoint {...props} />;
  }
  if (props.infopoint.shape === "ICON") {
    return <IconAnchorInfopoint {...props} />;
  }

  // NOTE: Defaults to square shape, because of backward compatibility
  return <SquareAnchorInfopoint {...props} />;
};

export default AnchorInfopoint;
