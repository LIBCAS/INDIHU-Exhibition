import { CSSProperties } from "react";

import { Icon as MuiIcon } from "@mui/material";
import FontIcon from "react-md/lib/FontIcons/FontIcon";

import cx from "classnames";

interface IconProps {
  name: string; // name either for FontIcon from 'react-md' or Icon from 'material-ui'
  useMaterialUiIcon?: boolean;
  color?: "default" | "primary" | "secondary" | "white";
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  noCenterPlace?: boolean; // by default, icon should be inside some container and centered
}

export const Icon = ({
  name,
  useMaterialUiIcon = false,
  color = "default",
  className,
  style,
  onClick,
  noCenterPlace = false,
}: IconProps) => {
  return (
    <div
      className={cx(
        !noCenterPlace && "grid place-items-center",
        className,
        color === "primary" && "text-primary",
        color === "white" && "text-white",
        color === "secondary" && "text-secondary",
        !!onClick && "hover:cursor-pointer"
      )}
    >
      {useMaterialUiIcon ? (
        <MuiIcon onClick={onClick} className="!text-inherit" sx={style}>
          {name}
        </MuiIcon>
      ) : (
        <FontIcon onClick={onClick} className="!text-inherit" style={style}>
          {name}
        </FontIcon>
      )}
    </div>
  );
};
