import FontIcon from "react-md/lib/FontIcons/FontIcon";
import cx from "classnames";

interface Props {
  name: string;
  className?: string;
  onClick?: () => void;
  color?: "default" | "primary" | "white";
}

export const Icon = ({
  name,
  className,
  onClick,
  color = "default",
}: Props) => {
  return (
    <div
      className={cx(
        "grid place-items-center",
        className,
        color === "primary" && "!text-primary",
        color === "white" && "!text-white",
        !!onClick && "hover:cursor-pointer"
      )}
    >
      <FontIcon onClick={onClick} className="!text-inherit">
        {name}
      </FontIcon>
    </div>
  );
};
