import { CSSProperties, ReactNode } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import { Icon as MuiIcon } from "@mui/material";
import FontIcon from "react-md/lib/FontIcons/FontIcon";
import { BasicTooltip } from "components/tooltip/BasicTooltip";
import { BasicTooltipProps } from "components/tooltip/tooltip-props";

// Utils
import cx from "classnames";

// - - - -

type IconProps = {
  name: string | ReactNode; // name either for FontIcon from 'react-md' or Icon from 'material-ui'
  useMaterialUiIcon?: boolean;
  color?:
    | "expoThemeMode"
    | "expoThemeIcons"
    | "primary"
    | "secondary"
    | "white"
    | "muted-400"
    | "inheritFromParents";
  onClick?: () => void;
  noCenterPlace?: boolean; // by default, icon should be inside some container and centered
  containerClassName?: string;
  containerStyle?: CSSProperties;
  iconClassName?: string;
  iconStyle?: CSSProperties;
  tooltip?: BasicTooltipProps;
};

// - - - -

export const Icon = ({
  name,
  useMaterialUiIcon = false,
  color = "inheritFromParents",
  onClick,
  noCenterPlace = false,
  containerClassName,
  containerStyle,
  iconClassName,
  iconStyle,
  tooltip,
}: IconProps) => {
  const { expoDesignData, fgThemingIf } = useExpoDesignData();

  const themeEnabledIconsColor =
    color === "expoThemeIcons" && expoDesignData?.iconsColor
      ? expoDesignData.iconsColor
      : undefined;

  return (
    <div
      className={cx(
        {
          "grid place-items-center": !noCenterPlace,
          // Apply black icons on light mode, white icons on dark mode if expoThemeMode color is set
          ...fgThemingIf(color === "expoThemeMode"),
          "text-primary": color === "expoThemeIcons" || color === "primary",
          "text-white": color === "white",
          "text-secondary": color === "secondary",
          "text-muted-400": color === "muted-400",
          "hover:cursor-pointer": !!onClick,
        },
        containerClassName
      )}
      style={{
        ...containerStyle,
        color: themeEnabledIconsColor,
      }}
      data-tooltip-id={tooltip?.id ?? undefined}
    >
      {/* Icon color either inherited from Button parent or div if some color prop is used */}
      {useMaterialUiIcon ? (
        <MuiIcon
          onClick={onClick}
          className={cx(iconClassName)}
          sx={{ color: "inherit", ...iconStyle }}
        >
          {name}
        </MuiIcon>
      ) : (
        <FontIcon
          onClick={onClick}
          className={cx(iconClassName)}
          style={{ color: "inherit", ...iconStyle }}
        >
          {name}
        </FontIcon>
      )}

      {tooltip && <BasicTooltip {...tooltip} />}
    </div>
  );
};
