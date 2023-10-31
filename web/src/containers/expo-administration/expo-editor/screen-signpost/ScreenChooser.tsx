import { useMemo } from "react";

import { useExpoScreenStructure } from "hooks/view-hooks/expo-screen-structure-hook";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  ListSubheader,
} from "@mui/material";

import { screenType } from "enums/screen-type";

// - -

// Utils
const parseScreenChooserStateToStringValue = (
  screenChooserState: ScreenChooserState | null
) => {
  if (screenChooserState === null) {
    return ""; // empty string will pick no option
  }
  const { chapterIndex, screenIndex } = screenChooserState;
  if (chapterIndex === "start") {
    return "start";
  }
  if (chapterIndex === "finish") {
    return "finish";
  }
  if (screenIndex === null) {
    console.error("Screen chooser has received invalid input value!");
    return "";
  }
  return `${chapterIndex}-${screenIndex}`;
};

const getChooserStateFromStringValue = (value: string): ScreenChooserState => {
  // "start" | "finish" |  "0-0"
  if (value === "start") {
    return { chapterIndex: "start", screenIndex: null };
  }
  if (value === "finish") {
    return { chapterIndex: "finish", screenIndex: null };
  }

  const [chapterIndex, screenIndex] = value.split("-");
  return {
    chapterIndex: parseInt(chapterIndex),
    screenIndex: parseInt(screenIndex),
  };
};

// - -

export type ScreenChooserState = {
  chapterIndex: "start" | "finish" | number; // numbering from 0
  screenIndex: number | null; // numbering from 0
};

type ScreenChooserProps = {
  value: ScreenChooserState | null;
  onChange: (newScreenChooserState: ScreenChooserState) => void;
};

const ScreenChooser = ({ value, onChange }: ScreenChooserProps) => {
  const { allScreensStructure } = useExpoScreenStructure();

  const selectFieldValue = useMemo(
    () => parseScreenChooserStateToStringValue(value),
    [value]
  );

  return (
    <FormControl variant="standard" fullWidth>
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
        Zvolená odkazová obrazovka
      </InputLabel>

      <Select
        labelId="screen-chooser-label"
        id="screen-chooser-select"
        value={selectFieldValue}
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

          const chooserState = getChooserStateFromStringValue(newValue);
          onChange(chooserState);
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
                  ? `${screen.chapterIndex}-${screen.screenIndex}`
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
    </FormControl>
  );
};

export default ScreenChooser;
