import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";

import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import HelpIcon from "components/help-icon";
import { screenType } from "enums/screen-type";

import { AppDispatch } from "store/store";
import { File as IndihuFile, Screen } from "models";

import { updateScreenData } from "actions/expoActions/screen-actions";

type TimeProps = {
  audio?: IndihuFile | null;
  activeScreen: Screen; // one of the many screens
  sumOfPhotosTimes?: number | null;
  disabled?: boolean;
  helpIconLabel?: string;
  helpIconId?: string;
};

const Time = ({
  audio,
  activeScreen,
  sumOfPhotosTimes,
  disabled = false,
  helpIconLabel,
  helpIconId,
}: TimeProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex-col">
      <div className="row flex-centered">
        {/* TextField component*/}
        <div className="form-input form-input-with-suffix">
          <TextField
            type="number"
            id="screen-image-textfield-time"
            label={t("descFields.screenTime")}
            value={"time" in activeScreen ? activeScreen.time : 20}
            disabled={
              disabled ||
              (audio &&
                audio.duration &&
                "timeAuto" in activeScreen &&
                activeScreen.timeAuto) ||
              ("timePhotosManual" in activeScreen &&
                activeScreen.timePhotosManual)
            }
            onChange={(newTime: number) => {
              if (
                isNaN(Number(newTime)) ||
                Number(newTime) < 3 ||
                Number(newTime) > 1000000
              ) {
                setError("Zadejte číslo v rozsahu 3 až 1000000.");
              } else {
                setError(null);
              }

              dispatch(updateScreenData({ time: Math.abs(newTime) }));
            }}
          />
          <span className="form-input-suffix">
            {t("descFields.screenTimeSeconds")}
          </span>
        </div>

        {/* Manual time checkbox */}
        {activeScreen?.type === screenType.SLIDESHOW &&
          sumOfPhotosTimes !== undefined && (
            <Checkbox
              id="editor-image-checkbox-time-photos-manual"
              name="simple-checkboxes"
              label={t("descFields.manualScreenTime")}
              disabled={disabled || activeScreen.timeAuto}
              checked={activeScreen.timePhotosManual}
              value={activeScreen.timePhotosManual}
              onChange={(newTimePhotosManual: boolean) => {
                dispatch(
                  updateScreenData({ timePhotosManual: newTimePhotosManual })
                );
              }}
            />
          )}

        {/* Automatic checkbox */}
        {!audio ||
        audio.duration ||
        ("time" in activeScreen && activeScreen.time) ? (
          <Checkbox
            id="editor-image-checkbox-time-auto"
            name="simple-checkboxes"
            label={t("descFields.automaticScreenTime")}
            checked={
              "timeAuto" in activeScreen &&
              activeScreen.timeAuto &&
              !!audio &&
              !!audio.duration
            }
            disabled={
              disabled ||
              !audio ||
              !audio.duration ||
              ("timePhotosManual" in activeScreen &&
                activeScreen.timePhotosManual)
            }
            onChange={(newTimeAuto: boolean) => {
              dispatch(updateScreenData({ timeAuto: newTimeAuto }));
              if (newTimeAuto && audio && audio.duration) {
                dispatch(
                  updateScreenData({
                    time: audio.duration + 2,
                  })
                );
              }
            }}
          />
        ) : "time" in activeScreen && !activeScreen.time ? (
          <strong
            className="margin-left-small invalid"
            style={{ fontSize: "0.75em", maxWidth: "200px" }}
          >
            Nelze získat dobu trvání vybraného audio souboru. Zadejte, prosím,
            dobu zobrazení obrazovky ručně.
          </strong>
        ) : (
          <div />
        )}

        {helpIconLabel && helpIconId && <HelpIcon label={helpIconLabel} />}
      </div>

      {error && (
        <div>
          <span className="invalid">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Time;
