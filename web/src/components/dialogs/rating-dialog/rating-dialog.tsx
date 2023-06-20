import {
  useState,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useMemo,
} from "react";

import Dialog from "../dialog-wrap-typed";
import { DialogType, DialogProps } from "../dialog-types";

// Components
import { Rating, FormControlLabel, Checkbox, TextField } from "@mui/material";
import { Icon } from "components/icon/icon";
import SquareIcon from "@mui/icons-material/Square";

// Utils
import cx from "classnames";

// - - - - - - - -

// Type meaning of "empty object"
export type RatingDialogDataProps = Record<string, never>;

export const RatingDialog = (_props: DialogProps<DialogType.RatingDialog>) => {
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [textValue, setTextValue] = useState<string>("");
  const [isTopicChecked, setIsTopicChecked] = useState<boolean>(false);
  const [isMediaChecked, setIsMediaChecked] = useState<boolean>(false);
  const [isTextChecked, setIsTextChecked] = useState<boolean>(false);
  const [isGameChecked, setIsGameChecked] = useState<boolean>(false);

  const numberOfCheckedCheckboxes = useMemo(() => {
    let counter = 0;
    if (isTopicChecked) counter++;
    if (isMediaChecked) counter++;
    if (isTextChecked) counter++;
    if (isGameChecked) counter++;
    return counter;
  }, [isGameChecked, isMediaChecked, isTextChecked, isTopicChecked]);

  const onSubmit = () => {
    const formData = {
      rating: ratingValue ?? undefined,
      text: textValue,
      preferences: {
        topic: isTopicChecked,
        media: isMediaChecked,
        text: isTextChecked,
        game: isGameChecked,
      },
    };
    console.log("formData: ", formData);
  };

  return (
    <Dialog
      name={DialogType.RatingDialog}
      title={
        <div className="text-2xl font-medium">Jak se vám líbila výstava?</div>
      }
      big
      noDialogMenu
    >
      <div className="px-8 py-4 flex flex-col items-center gap-5">
        {/* Rating Box */}
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="text-xl font-bold">Celkové hodnocení</div>
          <RatingInput
            ratingValue={ratingValue}
            setRatingValue={setRatingValue}
          />
        </div>

        {/* Checkbox section */}
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="text-xl font-bold">
            Co se vám nejvíce líbilo?{" "}
            <span className="text-lg">(max. 2 možnosti)</span>
          </div>

          <div className="flex flex-row w-full justify-center gap-4">
            <CheckBox
              label="Téma"
              isChecked={isTopicChecked}
              setIsChecked={setIsTopicChecked}
              disabled={numberOfCheckedCheckboxes >= 2 && !isTopicChecked}
            />
            <CheckBox
              label="Obrázky a videa"
              isChecked={isMediaChecked}
              setIsChecked={setIsMediaChecked}
              disabled={numberOfCheckedCheckboxes >= 2 && !isMediaChecked}
            />
            <CheckBox
              label="Texty"
              isChecked={isTextChecked}
              setIsChecked={setIsTextChecked}
              disabled={numberOfCheckedCheckboxes >= 2 && !isTextChecked}
            />
            <CheckBox
              label="Hry"
              isChecked={isGameChecked}
              setIsChecked={setIsGameChecked}
              disabled={numberOfCheckedCheckboxes >= 2 && !isGameChecked}
            />
          </div>
        </div>

        {/* TextArea section */}
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="text-xl font-bold">Vzkaz tvůrci</div>
          <TextField
            variant="filled"
            multiline
            rows={4}
            placeholder="V případe záujmu o odpoveď zanechte ve vzkazu svuj e-mail."
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "0px",
                padding: "16px 16px",
                backgroundColor: "#E9ECEF",
                "&.Mui-focused": {},
                "&:hover": {
                  backgroundColor: "#E9ECEF",
                },
              },
              "& .MuiInputBase-inputMultiline": {
                fontSize: "16px",
              },
              "& .MuiFilledInput-underline:after": {
                borderBottom: "none",
              },
            }}
            value={textValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTextValue(event.target.value);
            }}
          />
        </div>

        {/* Send Button */}
        <div className="mt-2">
          <SendButton
            disabled={ratingValue === null || numberOfCheckedCheckboxes === 0}
            onClick={onSubmit}
          />
        </div>
      </div>
    </Dialog>
  );
};

// - - - - - - - - -

interface RatingInputProps {
  ratingValue: number | null;
  setRatingValue: Dispatch<SetStateAction<number | null>>;
}

const RatingInput = ({ ratingValue, setRatingValue }: RatingInputProps) => {
  return (
    <Rating
      //name
      size="large"
      precision={0.5}
      value={ratingValue}
      onChange={(_event, newValue) => {
        setRatingValue(newValue);
      }}
      sx={{
        fontSize: "42px",
        color: "#FFB347",
      }}
    />
  );
};

// - - - - - - - -

interface CheckBoxProps {
  label: string;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}

const CheckBox = ({
  label,
  isChecked,
  setIsChecked,
  disabled,
}: CheckBoxProps) => {
  return (
    <FormControlLabel
      label={label}
      control={
        <Checkbox
          checkedIcon={<SquareIcon />}
          checked={isChecked}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setIsChecked(event.target.checked);
          }}
        />
      }
      disabled={disabled}
      sx={{
        "& .MuiSvgIcon-root": {
          fontSize: "22px",
        },

        "& .Mui-checked": {
          "& .MuiSvgIcon-root": {
            color: "#d2a473",
            fontSize: "22px",
            padding: "4px",
            border: "1px solid #d2a473",
            borderRadius: "5%",
          },
        },
      }}
    />
  );
};

// - - - - - - - - -

interface SendButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

const SendButton = ({ disabled, onClick }: SendButtonProps) => {
  return (
    <button
      className={cx(
        "p-4 bg-black text-white font-bold text-xl flex items-center gap-4",
        disabled && "text-disabled-dark bg-disabled-light"
      )}
      disabled={disabled}
      onClick={onClick}
    >
      Odeslat
      <Icon name="send" useMaterialUiIcon style={{ fontSize: "24px" }} />
    </button>
  );
};
