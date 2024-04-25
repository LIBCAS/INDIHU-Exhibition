import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

import { LanguageKey, languageKeys } from "i18n";
import { palette } from "palette";

// - -

type LanguageSelectProps = {
  isHeaderScrolled: boolean;
};

const LanguageSelect = ({ isHeaderScrolled }: LanguageSelectProps) => {
  const { i18n } = useTranslation("app-header");

  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <FormControl
      variant="standard"
      fullWidth
      sx={{
        border: "1px solid transparent",
        borderRadius: "60px",
        paddingLeft: "12px",
        paddingRight: "12px",
        paddingBottom: "4px",
        paddingTop: "4px",
        boxShadow: isFocused
          ? "inset 0 0 0 0.2rem rgb(0 123 255 / 25%)"
          : undefined,

        "& .MuiInputBase-root": {
          color: isHeaderScrolled ? palette["primary-blue"] : "white",
        },

        "& .MuiSvgIcon-root": {
          color: isHeaderScrolled ? palette["primary-blue"] : "white",
        },

        "& .MuiInputBase-root:before": {
          borderBottomWidth: "0px",
          borderColor: `${
            isHeaderScrolled ? palette["primary-blue"] : "white"
          } !important`,
        },

        "& .MuiInputBase-root:after": {
          borderBottomWidth: "0px",
        },

        "& .MuiInput-input:focus": {
          backgroundColor: "transparent",
        },

        "& .MuiSelect-select": {
          paddingTop: "4px",
          paddingBottom: "4px",
        },
      }}
    >
      <Select
        id="select-language"
        fullWidth
        value={
          i18n.language.startsWith("en")
            ? "en"
            : i18n.language.startsWith("sk")
            ? "sk"
            : "cs"
        }
        onChange={(event: SelectChangeEvent<LanguageKey>) => {
          const newLanguageValue = event.target.value as LanguageKey;
          i18n.changeLanguage(newLanguageValue);
        }}
        renderValue={(currValue) => (
          <div className="flex justify-start items-center gap-2 pr-2">
            <LanguageIcon sx={{ fontSize: "16px" }} />
            <span>
              {currValue === "en" ? "EN" : currValue === "sk" ? "SK" : "CS"}
            </span>
          </div>
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {languageKeys.map((languageKey) => (
          <MenuItem key={languageKey} value={languageKey}>
            {languageKey === "en" ? "EN" : languageKey === "sk" ? "SK" : "CS"}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
