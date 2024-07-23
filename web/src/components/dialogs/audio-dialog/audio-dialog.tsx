import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import DialogWrap from "../dialog-wrap-noredux-typed";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { Divider } from "components/divider/divider";
import { Slider } from "@mui/material";

// Actions
import {
  setExpoVolumes,
  muteVolumes,
  unmuteVolumes,
} from "actions/expoActions/viewer-actions";

// Models
import { AppState, AppDispatch } from "store/store";
import { Volumes } from "models";

// - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.expoVolumes,
  (expoVolumes) => ({
    expoVolumes,
  })
);

// - - - - - - -

export type AudioDialogProps = {
  closeThisDialog: () => void;
  hasSpeechVolume: boolean;
  hasMusicVolume: boolean;
  isVideoPresent: boolean;
};

export const AudioDialog = ({
  closeThisDialog,
  hasSpeechVolume,
  hasMusicVolume,
  isVideoPresent,
}: AudioDialogProps) => {
  const { expoVolumes } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("view-screen", {
    keyPrefix: "overlay.audioDialog",
  });

  const speechVolume = useMemo(() => expoVolumes.speechVolume, [expoVolumes]);
  const musicVolume = useMemo(() => expoVolumes.musicVolume, [expoVolumes]);

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">{t("title")}</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <div className="flex flex-col gap-5">
        {/* First slider */}
        {(hasSpeechVolume || isVideoPresent) && (
          <AudioSlider
            volumeKey="speechVolume"
            volumeObj={speechVolume}
            tooltipContent={t("speechIconTooltip")}
          />
        )}
        {/* Second slider */}
        {hasMusicVolume && (
          <AudioSlider
            volumeKey="musicVolume"
            volumeObj={musicVolume}
            tooltipContent={t("backgroundMusicIconTooltip")}
          />
        )}
      </div>

      <div className="mt-4">
        <Divider type="horizontal" />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          type="outlined"
          color="secondary"
          big
          onClick={() => dispatch(muteVolumes(expoVolumes))}
        >
          {t("muteEverythingLabel")}
        </Button>
        <Button
          type="contained"
          color="secondary"
          big
          onClick={() => dispatch(unmuteVolumes(expoVolumes))}
        >
          {t("amplifyEverythingLabel")}
        </Button>
      </div>
    </DialogWrap>
  );
};

// - - - - - - -

const getIconname = (
  volumeKey: "speechVolume" | "musicVolume",
  actualVolume: number
) => {
  if (volumeKey === "speechVolume") {
    return actualVolume === 0 ? "voice_over_off" : "record_voice_over";
  }
  return actualVolume === 0 ? "music_off" : "music_note";
};

interface AudioSliderProps {
  volumeKey: "speechVolume" | "musicVolume";
  volumeObj: Volumes;
  tooltipContent?: string;
}

const AudioSlider = ({
  volumeKey,
  volumeObj,
  tooltipContent,
}: AudioSliderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isLightMode } = useExpoDesignData();

  const iconName = getIconname(volumeKey, volumeObj.actualVolume);

  return (
    <div className="flex items-center gap-5">
      <Button
        onClick={() => {
          const newPreviousVolume =
            volumeObj.actualVolume === 0 ? 0 : volumeObj.actualVolume;
          const newActualVolume =
            volumeObj.actualVolume === 0 ? volumeObj.previousVolume : 0;

          dispatch(
            setExpoVolumes({
              [volumeKey]: {
                previousVolume: newPreviousVolume,
                actualVolume: newActualVolume,
              },
            })
          );
        }}
        tooltip={{
          id: `tooltip-${volumeKey}`,
          content: tooltipContent ?? "",
        }}
      >
        <Icon
          name={iconName}
          useMaterialUiIcon
          iconStyle={{ fontSize: "26px" }}
        />
      </Button>

      <Slider
        min={0}
        max={100}
        step={1}
        size="medium"
        // Making the slider not circle but square
        sx={{
          color: isLightMode ? "black" : "white",
          "& .MuiSlider-thumb": {
            borderRadius: "1px",
            "&:hover, &.Mui-focusVisible": {
              boxShadow: isLightMode
                ? `0px 0px 0px 8px rgba(0, 0, 0, 0.16)`
                : `0px 0px 0px 8px rgba(255, 255, 255, 0.16)`, // ${alpha(theme.palette.success.main, 0.16)}
            },
            "&.Mui-active": {
              boxShadow: isLightMode
                ? `0px 0px 0px 14px rgba(0, 0, 0, 0.16)`
                : `0px 0px 0px 14px rgba(255, 255, 255, 0.16)`, //${alpha(theme.palette.success.main, 0.16)}
            },
          },
        }}
        value={volumeObj.actualVolume}
        onChange={(_event: Event, newValue: number | number[]) => {
          dispatch(
            setExpoVolumes({
              [volumeKey]: {
                previousVolume: volumeObj.previousVolume,
                actualVolume: newValue as number,
              },
            })
          );
        }}
        onChangeCommitted={(event: any, newValue: number | number[]) => {
          dispatch(
            setExpoVolumes({
              [volumeKey]: {
                previousVolume: volumeObj.actualVolume,
                actualVolume: newValue as number,
              },
            })
          );
        }}
      />

      <div className="text-2xl font-bold">{volumeObj.actualVolume}</div>
    </div>
  );
};
