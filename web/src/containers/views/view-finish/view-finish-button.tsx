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
      // text-white
      className="flex w-24 flex-col items-center gap-4 text-white bg-transparent border-none hover:cursor-pointer"
      onClick={onClick}
      //style={{ color: "blue" }}
    >
      {/* border-white */}
      <div
        className="border-2 bg-transparent p-4 border-white"
        //style={{ borderColor: "blue" }}
      >
        {icon}
      </div>
      <span className="text-center">{label}</span>
    </button>
  );
};
