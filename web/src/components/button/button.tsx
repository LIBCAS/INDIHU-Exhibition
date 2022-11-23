import { forwardRef } from "react";

import cx from "classnames";

interface Props {
  onClick?: () => void;
  noPadding?: boolean;
  className?: string;
  color?: "default" | "primary" | "white";
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  shadow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      onClick,
      noPadding,
      iconBefore,
      iconAfter,
      className,
      color = "default",
      disabled = false,
      shadow,
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
        color === "default"
          ? "hover:bg-black hover:bg-opacity-10"
          : "hover:brightness-90",
        color === "primary" && "text-white bg-primary",
        color === "white" && "text-black bg-white",
        !disabled && "hover:cursor-pointer",
        shadow && "shadow-md"
      )}
    >
      {iconBefore}
      {children}
      {iconAfter}
    </button>
  )
);

Button.displayName = "Button";
