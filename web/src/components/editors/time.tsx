import { useState } from "react";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import { screenType } from "enums/screen-type";

import { File as IndihuFile, Screen } from "models";

type TimeProps = {
  audio?: IndihuFile;
  activeScreen: Screen; // one of the many screens
  updateScreenData: any;
  sumOfPhotosTimes?: number;
};

const Time = ({
  audio,
  activeScreen,
  updateScreenData,
  sumOfPhotosTimes,
}: TimeProps) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex-col">
      <div className="row flex-centered">
        {/* TextField component*/}
        <div className="form-input form-input-with-suffix">
          <TextField
            id="screen-image-textfield-time"
            label="Celková doba zobrazení obrazovky"
            value={"time" in activeScreen ? activeScreen.time : 20}
            disabled={
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

              updateScreenData({ time: Math.abs(newTime) });
            }}
            type="number"
          />
          <span className="form-input-suffix">vteřin</span>
        </div>

        {/* Manual time checkbox */}
        {activeScreen?.type === screenType.SLIDESHOW && sumOfPhotosTimes && (
          <Checkbox
            id="editor-image-checkbox-time-photos-manual"
            name="simple-checkboxes"
            label="Manuálne každej fotke nastaviť čas"
            disabled={activeScreen.timeAuto}
            checked={activeScreen.timePhotosManual}
            value={activeScreen.timePhotosManual}
            onChange={(newTimePhotosManual: boolean) => {
              updateScreenData({ timePhotosManual: newTimePhotosManual });
              if (newTimePhotosManual && sumOfPhotosTimes) {
                updateScreenData({ time: sumOfPhotosTimes });
              }
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
            label="Automaticky podle mluveného slova"
            checked={
              "timeAuto" in activeScreen &&
              activeScreen.timeAuto &&
              !!audio &&
              !!audio.duration
            }
            // value={
            //   "timeAuto" in activeScreen &&
            //   activeScreen.timeAuto &&
            //   audio &&
            //   audio.duration
            // }
            disabled={
              !audio ||
              !audio.duration ||
              ("timePhotosManual" in activeScreen &&
                activeScreen.timePhotosManual)
            }
            onChange={(newTimeAuto: boolean) => {
              updateScreenData({ timeAuto: newTimeAuto });
              if (newTimeAuto && audio && audio.duration) {
                updateScreenData({
                  time: audio.duration + 2,
                });
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
