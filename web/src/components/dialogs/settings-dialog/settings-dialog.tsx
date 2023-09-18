import { useState } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import Dialog from "../dialog-wrap-typed";
import { DialogProps, DialogType } from "../dialog-types";

// Language stuff
import { changeLanguage, LanguageKey, languageKeys } from "i18n";

import {
  FormControl,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from "@mui/material";

// list of countries: // https://github.com/madebybowtie/FlagKit/blob/master/Assets/Flags.md
import Flag from "react-flagkit";

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

// - - - - - - - -

// Type meaning of "empty object"
export type SettingsDialogDataProps = Record<string, never>;

export const SettingsDialog = (
  _props: DialogProps<DialogType.SettingsDialog>
) => {
  const [language, setLanguage] = useState<LanguageKey>("cs");
  const { isLightMode, palette } = useExpoDesignData();

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
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isLightMode ? undefined : palette["white"],
                },

                "& .MuiSvgIcon-root": {
                  color: isLightMode ? undefined : palette["white"],
                },
              }}
              // sx={{
              //   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              //     borderColor: "black",
              //     borderWidth: "2px",
              //   },
              // }}
            >
              {languageKeys.map((languageKey) => (
                <MenuItem key={languageKey} value={languageKey}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      color: isLightMode ? palette["black"] : palette["white"],
                    }}
                  >
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
      </div>
    </Dialog>
  );
};
