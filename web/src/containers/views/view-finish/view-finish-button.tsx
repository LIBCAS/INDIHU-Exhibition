import { ReactNode } from "react";

type ViewFinishButtonProps = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
};

export const ViewFinishButton = ({
  label,
  icon,
  onClick,
}: ViewFinishButtonProps) => {
  return (
    <button
      className="flex w-24 flex-col items-center gap-4 text-white bg-transparent border-none hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="border-2 border-white bg-transparent p-4">{icon}</div>
      <span className="text-center">{label}</span>
    </button>
  );
};
