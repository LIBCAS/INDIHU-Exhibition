import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

type InputArguments = {
  text: string;
  isAlwaysVisible: boolean;
  header?: string;
  onClose?: () => void;
};

export const renderInfopointBody = (args: InputArguments) => {
  return (
    <div className="flex flex-col gap-4 max-w-[350px]">
      {/* 1. Infopoint Header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">Infopoint</span>
        {!args.isAlwaysVisible && (
          <Button
            noPadding
            iconBefore={<Icon name="close" />}
            onClick={() => {
              if (args.onClose) {
                args.onClose();
              }
            }}
          />
        )}
      </div>

      {/* 2. Infopoint body */}
      <span>{args.text}</span>
    </div>
  );
};
