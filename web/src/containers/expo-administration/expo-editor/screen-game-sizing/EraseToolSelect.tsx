import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

// Models
import { EraserToolType, GameWipeScreen } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { updateScreenData } from "actions/expoActions/screen-actions";

// Images
import eraserImg from "../../../../assets/img/erasers/eraser.png";
import broomImg from "../../../../assets/img/erasers/broom.png";
import brushImg from "../../../../assets/img/erasers/brush.png";
import chiselImg from "../../../../assets/img/erasers/chisel.png";
import hammerImg from "../../../../assets/img/erasers/hammer.png";
import stickImg from "../../../../assets/img/erasers/stick.png";
import towelImg from "../../../../assets/img/erasers/towel.png";
import wipeTowelImg from "../../../../assets/img/erasers/wipe_towel.png";

// - -

type EraseToolSelectProps = { activeScreen: GameWipeScreen };

const EraseToolSelect = ({ activeScreen }: EraseToolSelectProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameWipeScreen",
  });

  return (
    <FormControl
      variant="standard"
      fullWidth
      sx={{
        "& .MuiInputBase-root:before": {
          borderBottomWidth: "0px",
        },
        "& .MuiInputBase-root:after": {
          borderBottomColor: "#083d77",
        },
        "& .MuiSelect-select": {
          textAlign: "left",
          paddingLeft: "8px",
        },
        "& .MuiSelect-select.MuiInputBase-input.MuiInput-input": {
          backgroundColor: "transparent",
        },
        "& label + .MuiInputBase-root": {
          marginTop: "22px", // gap between label and selectfield
        },
      }}
    >
      <InputLabel
        id="erase-tool-select-label"
        sx={{
          fontFamily: "Work Sans",
          color: "rgba(0,0,0,0.54)",
          //fontSize: "14px",
          "&.Mui-focused": {
            color: "#083d77",
          },
        }}
      >
        {t("chooseEraserTypeLabel")}
      </InputLabel>

      <Select<EraserToolType>
        id="erase-tool-select-select"
        labelId="erase-tool-select-label"
        label={t("chooseEraserTypeLabel")}
        value={activeScreen.eraserToolType ?? "eraser"}
        onChange={(e) => {
          const newEraserToolType = e.target.value;
          dispatch(updateScreenData({ eraserToolType: newEraserToolType }));
        }}
      >
        <MenuItem value="eraser">
          <div className="flex gap-3">
            <img src={eraserImg} alt="eraser-img" width={20} />
            <div>{t("eraserOption")}</div>
          </div>
        </MenuItem>

        <MenuItem value="broom">
          <div className="flex gap-3">
            <img src={broomImg} alt="broom-img" width={20} />
            <div>{t("broomOption")}</div>
          </div>
        </MenuItem>

        <MenuItem value="brush">
          <div className="flex gap-3">
            <img src={brushImg} alt="brush-img" width={20} />
            <div>{t("brushOption")}</div>
          </div>
        </MenuItem>

        <MenuItem value="chisel">
          <div className="flex gap-3">
            <img src={chiselImg} alt="chisel-img" width={20} />
            <div>{t("chiselOption")}</div>
          </div>
        </MenuItem>

        <MenuItem value="hammer">
          <div className="flex gap-3">
            <img src={hammerImg} alt="hammer-img" width={20} />
            <div>{t("hammerOption")}</div>
          </div>
        </MenuItem>

        <MenuItem value="stick">
          <div className="flex gap-3">
            <img src={stickImg} alt="stick-img" width={20} />
            <div>{t("stickOption")}</div>
          </div>
        </MenuItem>

        <MenuItem value="towel">
          <div className="flex gap-3">
            <img src={towelImg} alt="towel-img" width={20} />
            <div>{t("towelOption")}</div>
          </div>
        </MenuItem>

        <MenuItem value="wipe_towel">
          <div className="flex gap-3">
            <img src={wipeTowelImg} alt="wipe-towel-img" width={20} />
            <div>{t("wipeTowelOption")}</div>
          </div>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default EraseToolSelect;
