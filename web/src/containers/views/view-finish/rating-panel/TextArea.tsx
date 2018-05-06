import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { TextField, TextFieldProps } from "@mui/material";

type TextAreaProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder?: TextFieldProps["placeholder"];
  fullWidth?: TextFieldProps["fullWidth"];
  minRows?: TextFieldProps["minRows"];
  maxRows?: TextFieldProps["maxRows"];
  rows?: TextFieldProps["rows"];
  disabled?: TextFieldProps["disabled"];
};

const TextArea = ({
  value,
  setValue,
  placeholder,
  fullWidth = false,
  minRows,
  maxRows,
  rows,
  disabled,
}: TextAreaProps) => {
  const { isLightMode, palette } = useExpoDesignData();

  return (
    <TextField
      variant="filled"
      multiline
      minRows={minRows}
      maxRows={maxRows}
      rows={rows}
      placeholder={placeholder}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        "& .MuiInputBase-root": {
          borderRadius: "0px",
          padding: "16px 16px",
          backgroundColor: isLightMode
            ? palette["light-gray"]
            : palette["medium-gray"],
          "&.Mui-focused": {
            backgroundColor: isLightMode
              ? palette["light-gray"]
              : palette["medium-gray"],
          },
          "&:hover": {
            backgroundColor: isLightMode
              ? palette["light-gray"]
              : palette["medium-gray"],
          },
        },
        "& .MuiInputBase-inputMultiline": {
          fontSize: "16px",
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
      }}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }}
    />
  );
};

export default TextArea;
