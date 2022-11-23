import { connect } from "react-redux";
import { compose } from "recompose";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import AudioMusic from "./audio-music";

import { setDialog } from "../../actions/dialog-actions";

const Music = ({
  aloneScreen,
  music,
  updateScreenData,
  muteChapterMusic,
  helpIconTitle,
  id,
}) =>
  aloneScreen ? (
    <AudioMusic {...{ music, updateScreenData, helpIconTitle, id }} />
  ) : (
    <div className="row">
      <Checkbox
        id="editor-music-checkbox-chapter-music"
        name="simple-checkboxes"
        label="Vypnout zvukovou stopu kapitoly"
        checked={muteChapterMusic}
        value={muteChapterMusic}
        onChange={(value) => updateScreenData({ muteChapterMusic: value })}
        className="checkbox-shift-left-by-padding"
      />
    </div>
  );

export default compose(connect(null, { setDialog }))(Music);
