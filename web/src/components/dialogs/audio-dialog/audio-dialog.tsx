import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import Dialog from "../dialog-wrap-typed";
import { DialogType, DialogProps } from "../dialog-types";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { Divider } from "components/divider/divider";
import { Slider } from "@mui/material";

import { Tooltip } from "react-tooltip";

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

export type AudioDialogDataProps = {
  hasSpeechVolume: boolean;
  hasMusicVolume: boolean;
  isVideoPresent: boolean;
};

export const AudioDialog = (props: DialogProps<DialogType.AudioDialog>) => {
  const { dialogData } = props;
  const { expoVolumes } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const speechVolume = useMemo(() => expoVolumes.speechVolume, [expoVolumes]);
  const musicVolume = useMemo(() => expoVolumes.musicVolume, [expoVolumes]);

  if (!dialogData) {
    return null;
  }

  return (
    <Dialog
      name={DialogType.AudioDialog}
      title={<span className="text-2xl font-bold">Nastavení zvuku</span>}
      noDialogMenu
    >
      <div className="flex flex-col gap-5">
        {/* First slider */}
        {(dialogData.hasSpeechVolume || dialogData.isVideoPresent) && (
          <AudioSlider
            volumeKey="speechVolume"
            volumeObj={speechVolume}
            tooltipContent={"Zvuková stopa mluvené řeči"}
          />
        )}
        {/* Second slider */}
        {dialogData.hasMusicVolume && (
          <AudioSlider
            volumeKey="musicVolume"
            volumeObj={musicVolume}
            tooltipContent={"Zvuková stopa podkresové hudby"}
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
          Ztlumit vše
        </Button>
        <Button
          type="contained"
          color="secondary"
          big
          onClick={() => dispatch(unmuteVolumes(expoVolumes))}
        >
          Zesílit vše
        </Button>
      </div>
    </Dialog>
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
      >
        <div
          data-tooltip-id={`tooltip-${volumeKey}`}
          data-tooltip-content={tooltipContent}
        >
          <Icon
            name={iconName}
            useMaterialUiIcon
            style={{ fontSize: "26px" }}
          />
        </div>
      </Button>

      <Slider
        min={0}
        max={100}
        step={1}
        size="medium"
        // Making the slider not circle but square
        sx={{
          color: "black",
          "& .MuiSlider-thumb": {
            borderRadius: "1px",
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 8px rgba(0, 0, 0, 0.16)`, // ${alpha(theme.palette.success.main, 0.16)}
            },
            "&.Mui-active": {
              boxShadow: `0px 0px 0px 14px rgba(0, 0, 0, 0.16)`, //${alpha(theme.palette.success.main, 0.16)}
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
      <Tooltip id={`tooltip-${volumeKey}`} />
    </div>
  );
};
