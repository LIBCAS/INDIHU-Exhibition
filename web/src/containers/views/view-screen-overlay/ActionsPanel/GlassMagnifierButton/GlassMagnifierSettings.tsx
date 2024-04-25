import {
  Box,
  Slider,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
} from "@mui/material";
import {
  GlassMagnifierType,
  useGlassMagnifierConfig,
} from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";

import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useTranslation } from "react-i18next";

// - -

type GlassMagnifierSettingsProps = {
  biggerElements?: boolean;
};

const GlassMagnifierSettings = ({
  biggerElements = false,
}: GlassMagnifierSettingsProps) => {
  const { t } = useTranslation("view-screen", {
    keyPrefix: "overlay.glassMagnifier",
  });

  const {
    isGlassMagnifierEnabled,
    setIsGlassMagnifierEnabled,
    glassMagnifierType,
    setGlassMagnifierType,
    glassMagnifierPxSize,
    setGlassMagnifierPxSize,
    scaleZoomSize,
    setScaleZoomSize,
  } = useGlassMagnifierConfig();

  const { isLightMode, palette } = useExpoDesignData();

  return (
    <div className="w-64 px-6 py-2 flex flex-col gap-2 overflow-hidden">
      <Box className="flex justify-between items-center">
        <Typography
          variant={biggerElements ? "subtitle1" : "subtitle2"}
          sx={{ color: isLightMode ? undefined : palette["white"] }}
        >
          {t("magnifierTurningOn")}
        </Typography>
        <Switch
          size="medium"
          checked={isGlassMagnifierEnabled}
          onChange={(e) => {
            const newValue = e.target.checked;
            setIsGlassMagnifierEnabled(newValue);
          }}
          sx={{
            "& .MuiSwitch-switchBase": {
              "&.Mui-checked": {
                color: isLightMode ? palette["black"] : palette["white"],
              },
              "&.Mui-checked+.MuiSwitch-track": {
                backgroundColor: isLightMode
                  ? palette["black"]
                  : palette["white"],
              },
            },

            "& .MuiSwitch-track": {
              backgroundColor: isLightMode ? undefined : palette["medium-gray"],
            },
          }}
        />
      </Box>

      <Box className="flex flex-col">
        <Typography
          variant={biggerElements ? "subtitle1" : "subtitle2"}
          sx={{ color: isLightMode ? undefined : palette["white"] }}
        >
          {t("magnifierType")}
        </Typography>
        <FormControl>
          <RadioGroup
            row
            value={glassMagnifierType}
            onChange={(e) => {
              const newValue = e.target.value as GlassMagnifierType;
              setGlassMagnifierType(newValue);
            }}
          >
            <FormControlLabel
              value="SQUARE"
              control={<Radio size={biggerElements ? "medium" : "small"} />}
              label={t("squareOption")}
              // css-vqmohf-MuiButtonBase-root-MuiRadio-root.Mui-checked
              sx={{
                "& .MuiRadio-root": {
                  color: isLightMode ? palette["black"] : palette["white"],
                  "&.Mui-checked": {
                    color: isLightMode ? palette["black"] : palette["white"],
                  },
                },
              }}
            />
            <FormControlLabel
              value="CIRCLE"
              control={<Radio size={biggerElements ? "medium" : "small"} />}
              label={t("circleOption")}
              sx={{
                "& .MuiRadio-root": {
                  color: isLightMode ? palette["black"] : palette["white"],
                  "&.Mui-checked": {
                    color: isLightMode ? palette["black"] : palette["white"],
                  },
                },
              }}
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box className="flex flex-col">
        <Typography
          variant={biggerElements ? "subtitle1" : "subtitle2"}
          sx={{ color: isLightMode ? undefined : palette["white"] }}
        >
          {t("magnifierSize")}
        </Typography>
        <Slider
          min={50}
          max={250}
          step={10}
          size={biggerElements ? "medium" : "small"}
          marks
          valueLabelDisplay="auto"
          sx={{
            color: isLightMode ? palette["black"] : palette["white"],
            "& .MuiSlider-thumb": {
              borderRadius: "1px",
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px ${
                  isLightMode
                    ? "rgba(0, 0, 0, 0.16)"
                    : "rgba(255, 255, 255, 0.16)"
                } `,
              },
              "&.Mui-active": {
                boxShadow: `0px 0px 0px 8px ${
                  isLightMode
                    ? "rgba(0, 0, 0, 0.16)"
                    : "rgba(255, 255, 255, 0.16)"
                } `,
              },
            },
          }}
          value={glassMagnifierPxSize}
          onChange={(_event: Event, newValue: number | number[]) => {
            if (typeof newValue === "number") {
              setGlassMagnifierPxSize(newValue);
            }
          }}
        />
      </Box>

      <Box className="flex flex-col">
        <Typography
          variant={biggerElements ? "subtitle1" : "subtitle2"}
          sx={{ color: isLightMode ? undefined : palette["white"] }}
        >
          {t("zoomSize")}
        </Typography>
        <Slider
          min={1}
          max={5}
          step={1}
          size={biggerElements ? "medium" : "small"}
          marks
          valueLabelDisplay="auto"
          sx={{
            color: isLightMode ? palette["black"] : palette["white"],
            "& .MuiSlider-thumb": {
              borderRadius: "1px",
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px ${
                  isLightMode
                    ? "rgba(0, 0, 0, 0.16)"
                    : "rgba(255, 255, 255, 0.16)"
                } `,
              },
              "&.Mui-active": {
                boxShadow: `0px 0px 0px 8px ${
                  isLightMode
                    ? "rgba(0, 0, 0, 0.16)"
                    : "rgba(255, 255, 255, 0.16)"
                } `,
              },
            },
          }}
          value={scaleZoomSize}
          onChange={(_event: Event, newValue: number | number[]) => {
            if (typeof newValue === "number") {
              setScaleZoomSize(newValue);
            }
          }}
        />
      </Box>
    </div>
  );
};

export default GlassMagnifierSettings;
