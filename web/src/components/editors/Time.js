import React from "react";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

const Time = ({ audio, activeScreen, updateScreenData }) =>
  <div className="row flex-centered">
    <div className="form-input">
      <TextField
        id="screen-image-textfield-time"
        className="form-input-with-suffix"
        label="Celková doba zobrazení obrazovky"
        value={activeScreen.time}
        disabled={activeScreen.timeAuto}
        onChange={value => {
          if (!isNaN(Number(value)))
            updateScreenData({ time: Math.abs(value) });
        }}
      />
      <span className="form-input-suffix">vteřin</span>
    </div>
    <Checkbox
      id="editor-image-checkbox-time-auto"
      name="simple-checkboxes"
      label="Automaticky podle mluveného slova"
      checked={activeScreen.timeAuto}
      value={activeScreen.timeAuto}
      disabled={!audio}
      onChange={value => {
        updateScreenData({ timeAuto: value });
        if (value && audio)
          updateScreenData({
            time: audio.duration
          });
      }}
    />
  </div>;

export default Time;
