import { CSSProperties } from "react";

import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { Icon as MuiIcon } from "@mui/material";
import FontIcon from "react-md/lib/FontIcons/FontIcon";

import cx from "classnames";

interface IconProps {
  name: string; // name either for FontIcon from 'react-md' or Icon from 'material-ui'
  useMaterialUiIcon?: boolean;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "white"
    | "muted-400"
    | "expoTheme";
  onClick?: () => void;
  noCenterPlace?: boolean; // by default, icon should be inside some container and centered
  className?: string;
  style?: CSSProperties;
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
  const { expoDesignData } = useExpoDesignData();

  const themeEnabledIconsColor =
    color === "expoTheme" && expoDesignData?.iconsColor
      ? expoDesignData.iconsColor
      : undefined;

  return (
    <div
      className={cx({
        "grid place-items-center": !noCenterPlace,
        "text-primary": color === "primary" || color === "expoTheme",
        "text-white": color === "white",
        "text-secondary": color === "secondary",
        "text-muted-400": color === "muted-400",
        "hover:cursor-pointer": !!onClick,
        className,
      })}
      style={{
        color: themeEnabledIconsColor,
      }}
    >
      {/* Icon color either inherited from Button parent or div if some color prop is used */}
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
