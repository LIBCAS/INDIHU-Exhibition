import { useState } from "react";

import Dialog from "../dialog-wrap-typed";
import { DialogProps, DialogType } from "../dialog-types";

// Language stuff
import { changeLanguage, LanguageKey, languageKeys } from "i18n";
// import { Theme } from "models";

import {
  FormControl,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from "@mui/material";

// list of countries: // https://github.com/madebybowtie/FlagKit/blob/master/Assets/Flags.md
import Flag from "react-flagkit";

// import LightModeIcon from "@mui/icons-material/LightMode";
// import DarkModeIcon from "@mui/icons-material/DarkMode";

// - - - - - - - -

const getLanguageText = (language: LanguageKey) => {
  if (language === "cs") {
    return "Česky";
  }
  return "Anglicky";
};

const getLanguageFlagIcon = (language: LanguageKey) => {
  if (language === "cs") {
    return "CZ";
  }
  return "GB";
};

// const getThemeText = (theme: Theme) => {
//   if (theme === "DARK") {
//     return "Tmavý";
//   }
//   return "Svetlý";
// };

// const getThemeIcon = (theme: Theme) => {
//   if (theme === "DARK") {
//     return <DarkModeIcon sx={{ fontSize: "20px" }} />;
//   }
//   return <LightModeIcon sx={{ fontSize: "20px" }} />;
// };

// - - - - - - - -

// Type meaning of "empty object"
export type SettingsDialogDataProps = Record<string, never>;

export const SettingsDialog = (
  _props: DialogProps<DialogType.SettingsDialog>
) => {
  const [language, setLanguage] = useState<LanguageKey>("cs");
  // const [theme, setTheme] = useState<Theme>("LIGHT");

  return (
    <Dialog
      name={DialogType.SettingsDialog}
      title={<span className="text-2xl font-bold">Nastavenia</span>}
      noDialogMenu
    >
      <div className="flex flex-col gap-4 px-2 ">
        {/* 1. Language option*/}
        <div className="flex flex-row justify-between items-center">
          <div className="text-xl font-medium w-1/2 ">Výber jazyka: </div>
          <FormControl size="medium" sx={{ width: "50%" }}>
            <Select
              fullWidth
              variant="outlined"
              id="select-language"
              value={language}
              onChange={(event: SelectChangeEvent<LanguageKey>) => {
                const newLanguageValue = event.target.value as LanguageKey;
                setLanguage(newLanguageValue);
                changeLanguage(newLanguageValue);
              }}
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                  borderWidth: "2px",
                },
              }}
            >
              {languageKeys.map((languageKey) => (
                <MenuItem key={languageKey} value={languageKey}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Flag
                      country={getLanguageFlagIcon(languageKey)}
                      size={25}
                    />
                    <span>{getLanguageText(languageKey as LanguageKey)}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* 2. Theme option */}
        {/* <div className="flex flex-row justify-between items-center">
          <div className="text-xl font-medium w-1/2">Výber motívu</div>
          <FormControl size="medium" sx={{ width: "50%" }}>
            <Select
              fullWidth
              variant="outlined"
              id="select-theme"
              value={theme}
              onChange={(event: SelectChangeEvent<Theme>) => {
                const newThemeValue = event.target.value as Theme;
                setTheme(newThemeValue);
              }}
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                  borderWidth: "2px",
                },
              }}
            >
              {["light", "dark"].map((theme) => (
                <MenuItem key={theme} value={theme}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {getThemeIcon(theme as Theme)}
                    <span>{getThemeText(theme as Theme)}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div> */}
      </div>
    </Dialog>
  );
};
