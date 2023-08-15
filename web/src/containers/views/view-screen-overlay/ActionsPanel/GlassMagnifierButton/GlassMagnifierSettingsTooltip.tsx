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

const GlassMagnifierSettingsTooltip = () => {
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

  return (
    <div className="w-64 px-6 py-2 flex flex-col gap-2 overflow-hidden">
      <Box className="flex justify-between items-center">
        <Typography variant="subtitle2">Zapnutie lupy</Typography>
        <Switch
          size="medium"
          checked={isGlassMagnifierEnabled}
          onChange={(e) => {
            const newValue = e.target.checked;
            setIsGlassMagnifierEnabled(newValue);
          }}
          sx={{
            "& .MuiSwitch-switchBase": {
              "&.Mui-checked": { color: "black" },
              "&.Mui-checked+.MuiSwitch-track": { backgroundColor: "black" },
            },
          }}
        />
      </Box>

      <Box className="flex flex-col">
        <Typography variant="subtitle2">Typ lupy</Typography>
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
              control={<Radio size="small" />}
              label="Štvorec"
              // css-vqmohf-MuiButtonBase-root-MuiRadio-root.Mui-checked
              sx={{
                "& .MuiRadio-root": {
                  "&.Mui-checked": {
                    color: "black",
                  },
                },
              }}
            />
            <FormControlLabel
              value="CIRCLE"
              control={<Radio size="small" />}
              label="Kruh"
              sx={{
                "& .MuiRadio-root": {
                  "&.Mui-checked": {
                    color: "black",
                  },
                },
              }}
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box className="flex flex-col">
        <Typography variant="subtitle2">Velikost lupy</Typography>
        <Slider
          min={50}
          max={250}
          step={10}
          size="small"
          marks
          valueLabelDisplay="auto"
          sx={{
            color: "black",
            "& .MuiSlider-thumb": {
              borderRadius: "1px",
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px rgba(0, 0, 0, 0.16)`,
              },
              "&.Mui-active": {
                boxShadow: `0px 0px 0px 8px rgba(0, 0, 0, 0.16)`,
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
        <Typography variant="subtitle2">Velikost zoomu</Typography>
        <Slider
          min={1}
          max={5}
          step={1}
          size="small"
          marks
          valueLabelDisplay="auto"
          sx={{
            color: "black",
            "& .MuiSlider-thumb": {
              borderRadius: "1px",
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px rgba(0, 0, 0, 0.16)`,
              },
              "&.Mui-active": {
                boxShadow: `0px 0px 0px 8px rgba(0, 0, 0, 0.16)`,
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

export default GlassMagnifierSettingsTooltip;
