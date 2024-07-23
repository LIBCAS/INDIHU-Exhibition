import TextField from "react-md/lib/TextFields";

type PinTextFieldProps = {
  pinTextValue: string;
  index: number;
  onPinTextUpdate: (newPinText: string) => void;
};

export const PinTextField = ({
  pinTextValue,
  index,
  onPinTextUpdate,
}: PinTextFieldProps) => {
  return (
    <div className="flex-row-nowrap">
      <TextField
        id={`game-find-pin-text-field-${index}`}
        label={`${index + 1}.`}
        defaultValue={pinTextValue}
        onChange={(newPinTextValue: string) => {
          onPinTextUpdate(newPinTextValue);
        }}
      />
    </div>
  );
};
