import React from "react";
import { compose, withState } from "recompose";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

const Time = ({ audio, activeScreen, updateScreenData, error, setError }) => (
  <div className="flex-col">
    <div className="row flex-centered">
      <div className="form-input form-input-with-suffix">
        <TextField
          id="screen-image-textfield-time"
          label="Celková doba zobrazení obrazovky"
          value={activeScreen.time}
          disabled={activeScreen.timeAuto && audio && audio.duration}
          onChange={value => {
            if (
              isNaN(Number(value)) ||
              Number(value) < 3 ||
              Number(value) > 1000000
            ) {
              setError("Zadejte číslo v rozsahu 3 až 1000000.");
            } else {
              setError(null);
            }

            updateScreenData({ time: Math.abs(value) });
          }}
          type="number"
        />
        <span className="form-input-suffix">vteřin</span>
      </div>
      {!audio || audio.duration || activeScreen.time ? (
        <Checkbox
          id="editor-image-checkbox-time-auto"
          name="simple-checkboxes"
          label="Automaticky podle mluveného slova"
          checked={activeScreen.timeAuto && audio && audio.duration}
          value={activeScreen.timeAuto && audio && audio.duration}
          disabled={!audio || !audio.duration}
          onChange={value => {
            updateScreenData({ timeAuto: value });
            if (value && audio)
              updateScreenData({
                time: audio.duration + 2
              });
          }}
        />
      ) : !activeScreen.time ? (
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

export default compose(withState("error", "setError", null))(Time);
