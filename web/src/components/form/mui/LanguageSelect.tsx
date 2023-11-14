import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

// list of countries here: https://github.com/madebybowtie/FlagKit/blob/master/Assets/Flags.md
import Flag from "react-flagkit";

// Language stuff
import { LanguageKey, languageKeys } from "i18n";

// - -

const getLanguageFlagIcon = (language: LanguageKey) => {
  if (language === "cs") {
    return "CZ";
  }
  return "GB";
};

// - -

type LanguageSelectProps = {
  isSmallerVariant?: boolean;
  forceWhiteColoring?: boolean;
};

const LanguageSelect = ({
  isSmallerVariant = false,
  forceWhiteColoring = false,
}: LanguageSelectProps) => {
  const { isLightMode, palette } = useExpoDesignData(); // theme does not work in activeExpo or in app (only where viewExpo is loaded)
  const { t, i18n } = useTranslation("app-header");

  return (
    <FormControl
      size={isSmallerVariant ? "small" : "medium"}
      fullWidth
      sx={{
        minWidth: "140px",
        "& .MuiSelect-select": {
          paddingTop: isSmallerVariant ? "12px" : "18px",
          paddingBottom: isSmallerVariant ? "8px" : "14px",
          color: forceWhiteColoring ? palette["white"] : undefined,
        },

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor:
            isLightMode && !forceWhiteColoring ? undefined : palette["white"],
        },

        "& .MuiSvgIcon-root": {
          color:
            isLightMode && !forceWhiteColoring ? undefined : palette["white"],
        },

        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor:
            isLightMode && !forceWhiteColoring
              ? undefined
              : palette["muted-400"],
        },

        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderWidth: "2px",
            borderColor:
              isLightMode && !forceWhiteColoring
                ? palette["black"]
                : palette["white"],
          },
      }}
    >
      <Select
        id="select-language"
        variant="outlined"
        fullWidth
        value={i18n.language.startsWith("en") ? "en" : ("cs" as LanguageKey)}
        onChange={(event: SelectChangeEvent<LanguageKey>) => {
          const newLanguageValue = event.target.value as LanguageKey;
          i18n.changeLanguage(newLanguageValue);
        }}
      >
        {languageKeys.map((languageKey) => (
          <MenuItem key={languageKey} value={languageKey}>
            <div
              className="flex gap-2"
              style={{
                color: forceWhiteColoring
                  ? undefined
                  : isLightMode
                  ? palette["black"]
                  : palette["white"],
              }}
            >
              <Flag country={getLanguageFlagIcon(languageKey)} size={25} />
              <span>
                {languageKey === "cs"
                  ? t("languageSelect.czech")
                  : t("languageSelect.english")}
              </span>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
