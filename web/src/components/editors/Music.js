import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import AudioMusic from "./AudioMusic";

import { setDialog } from "../../actions/dialogActions";

const Music = ({
  aloneScreen,
  music,
  updateScreenData,
  setDialog,
  muteChapterMusic,
  helpIconTitle,
  id
}) =>
  aloneScreen
    ? <AudioMusic {...{ music, updateScreenData, helpIconTitle, id }} />
    : <div className="row flex-centered">
        <Checkbox
          id="editor-music-checkbox-chapter-music"
          name="simple-checkboxes"
          label="Vypnout zvukovou stopu kapitoly"
          checked={muteChapterMusic}
          value={muteChapterMusic}
          onChange={value => updateScreenData({ muteChapterMusic: value })}
        />
      </div>;

export default compose(connect(null, { setDialog }))(Music);
