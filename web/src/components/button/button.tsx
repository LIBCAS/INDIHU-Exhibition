import { CSSProperties, forwardRef } from "react";

import cx from "classnames";

interface ButtonProps {
  color?: "default" | "primary" | "secondary" | "white";
  type?: "text" | "outlined" | "contained";
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  noPadding?: boolean;
  big?: boolean;
  shadow?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
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
      children,
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "border-0 flex items-center gap-2 font-semibold whitespace-nowrap",
        className,
        noPadding ? "p-0" : "px-2 py-1",
        big ? "text-lg font-bold px-4 py-2" : "", // these paddings will overwrite the above one

        color === "default"
          ? "hover:bg-black hover:bg-opacity-10"
          : "hover:brightness-90",
        color === "white" && "text-black bg-white",
        // Primary color
        color === "primary" && type === "contained" && "text-white bg-primary",
        color === "primary" && type === "text" && "text-primary bg-white",
        color === "primary" &&
          type === "outlined" &&
          "text-primary bg-white border-solid border-primary border-2",
        // Secondary color
        color === "secondary" &&
          type === "contained" &&
          "text-white bg-secondary",
        color === "secondary" && type === "text" && "text-secondary bg-white",
        color === "secondary" &&
          type === "outlined" &&
          "text-secondary bg-white border-solid border-secondary border-2",

        !disabled && "hover:cursor-pointer",
        shadow && "shadow-md"
      )}
      style={style}
    >
      {iconBefore}
      {children}
      {iconAfter}
    </button>
  )
);

Button.displayName = "Button";
