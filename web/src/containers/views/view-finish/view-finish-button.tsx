import { ReactNode, CSSProperties } from "react";
import cx from "classnames";

type ViewFinishButtonProps = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

export const ViewFinishButton = ({
  label,
  icon,
  onClick,
  className,
  style,
}: ViewFinishButtonProps) => {
  return (
    <button
      className={cx(
        "flex w-24 flex-col items-center gap-4 text-white bg-transparent border-none hover:cursor-pointer",
        className
      )}
      onClick={onClick}
      style={style}
    >
      <div className="border-2 bg-transparent p-4 border-white">{icon}</div>
      <span className="text-center">{label}</span>
    </button>
  );
};
