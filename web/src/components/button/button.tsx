import { MouseEvent } from "react";
import { CSSProperties, forwardRef } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import cx from "classnames";
import { BasicTooltip } from "components/tooltip/tooltip";

type TooltipOption = {
  id: string;
  content: string;
  variant?: "light" | "dark";
};

interface ButtonProps {
  color?: "default" | "primary" | "secondary" | "white" | "expoTheme";
  type?: "text" | "outlined" | "contained";
  onClick?:
    | (() => void)
    | ((e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void);
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  noPadding?: boolean;
  big?: boolean;
  shadow?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  tooltip?: TooltipOption;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = "default",
      type = "contained",
      onClick,
      className,
      style,
      disabled = false,
      noPadding,
      big,
      shadow,
      iconBefore,
      iconAfter,
      tooltip,
      children,
    },
    ref
  ) => {
    const { isLightMode, bfFgThemingIf } = useExpoDesignData();

    return (
      <>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={onClick}
          className={cx(
            "border-0 flex justify-center items-center gap-2 font-semibold whitespace-nowrap",
            noPadding ? "p-0" : "px-2 py-1",
            {
              "text-lg font-bold px-4 py-2": big, // these paddings will overwrite the above one
              "hover:cursor-pointer": !disabled,
              "shadow-md": shadow,
              "hover:brightness-90": color !== "default",
              // "Default" color (e.g when not set any color)
              "hover:bg-black hover:bg-opacity-10":
                color === "default" && isLightMode,
              "hover:bg-white hover:bg-opacity-10":
                color === "default" && !isLightMode,
              // "White" color
              "bg-white text-black": color === "white",
              // "Primary" color
              "bg-primary text-white":
                color === "primary" && type === "contained",
              "bg-white text-primary": color === "primary" && type === "text",
              "bg-white text-primary border-solid border-primary border-2":
                color === "primary" && type === "outlined",
              // "Secondary color"
              "bg-secondary text-white":
                color === "secondary" && type === "contained",
              "bg-white text-secondary":
                color === "secondary" && type === "text",
              "bg-white text-secondary border-solid border-secondary border-2":
                color === "secondary" && type === "outlined",
              // "expoTheme color.. use color by actual set expo theme"
              ...bfFgThemingIf(color === "expoTheme"),
            },
            className
          )}
          style={style}
        >
          {iconBefore}
          {children}
          {iconAfter}
        </button>

        {tooltip && <BasicTooltip {...tooltip} />}
      </>
    );
  }
);

Button.displayName = "Button";
