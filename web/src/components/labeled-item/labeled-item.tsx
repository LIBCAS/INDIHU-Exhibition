import { FC } from "react";

interface Props {
  label: string;
  delimiter?: string;
}

export const LabeledItem: FC<Props> = ({
  label,
  delimiter = ":",
  children,
}) => {
  return (
    <div className="py-1">
      <span className="text-muted mr-2">
        {label.trim()}
        {delimiter}
      </span>
      <span>{children}</span>
    </div>
  );
};
