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
    <div className="py-2 text-lg">
      <span className="text-gray mr-3">
        {label.trim()}
        {delimiter}
      </span>
      <span>{children}</span>
    </div>
  );
};
