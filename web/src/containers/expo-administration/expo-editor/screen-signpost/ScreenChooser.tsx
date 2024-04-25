import { useExpoScreenStructure } from "hooks/view-hooks/expo-screen-structure-hook";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  ListSubheader,
  FormHelperText,
} from "@mui/material";

import { screenType } from "enums/screen-type";

// - -

type ScreenChooserProps = {
  value: string | "start" | "finish" | null; // screen.id as string, or initial null (start and finish screns do not have id)
  onChange: (newScreenId: string | "start" | "finish") => void;
  label: string;
  helperText?: string;
  error?: boolean;
};

const ScreenChooser = ({
  value,
  onChange,
  label,
  helperText,
  error,
}: ScreenChooserProps) => {
  const { allScreensStructure } = useExpoScreenStructure();

  return (
    <FormControl
      variant="standard"
      fullWidth
      error={error}
      sx={{
        "& .MuiFormHelperText-root": {
          fontSize: "12px",
          fontFamily: "Work Sans",
        },
      }}
    >
      <InputLabel
        id="screen-chooser-label"
        sx={{
          color: "rgba(0, 0, 0, 0.54)",
          fontSize: "13px",
          fontFamily: "Work Sans",
          "&.MuiInputLabel-shrink": {
            color: "rgba(0, 0, 0, 0.54)",
            fontSize: "15px",
          },
          "&.Mui-focused": {
            color: "#083d77",
            fontSize: "15px",
          },
        }}
      >
        {label}
      </InputLabel>

      <Select
        labelId="screen-chooser-label"
        id="screen-chooser-select"
        value={value ?? ""}
        onChange={(
          event: SelectChangeEvent<string | "start" | "finish" | "">
        ) => {
          const newValue = event.target.value;
          if (newValue === "") {
            console.error(
              "Failed to select screen in ScreenChooser component!"
            );
            return;
          }
          onChange(newValue);
        }}
        sx={{
          "& .MuiSelect-standard": {
            paddingBottom: "8px",
            paddingTop: "6px",
          },
          "& .MuiInput-input:focus": {
            backgroundColor: "transparent",
          },
          ":after": { borderBottomColor: "#083d77" },
        }}
        MenuProps={{ style: { maxHeight: "50vh" } }}
      >
        {allScreensStructure?.map((screen, screenIndex) => {
          if (!screen) {
            return null;
          }

          if (screen.type === "DELIMITOR") {
            return (
              <ListSubheader key={`delimitor-${screenIndex}`}>
                {screen.chapterIndex === "start" && "Start screen"}
                {screen.chapterIndex === "finish" && "Finish screen"}
                {typeof screen.chapterIndex === "number" &&
                  `Chapter ${screen.chapterIndex + 1}`}
              </ListSubheader>
            );
          }

          return (
            <MenuItem
              key={screenIndex}
              value={
                screen.type === screenType.START
                  ? "start"
                  : screen.type === screenType.FINISH
                  ? "finish"
                  : "chapterIndex" in screen && "screenIndex" in screen
                  ? screen.id
                  : "" // NOTE: "" will select no option
              }
            >
              {screen.type === screenType.FINISH
                ? "Záverečná obrazovka"
                : `${screen.title ?? "Undefined title"}`}
            </MenuItem>
          );
        })}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ScreenChooser;
