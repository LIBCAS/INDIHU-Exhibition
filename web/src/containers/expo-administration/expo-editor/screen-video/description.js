import { connect } from "react-redux";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import HelpIcon from "components/help-icon";
import Music from "components/editors/music";
import WysiwygEditor from "components/editors/WysiwygEditor/WysiwygEditor";

import { getFileById } from "actions/file-actions";
import { helpIconText } from "enums/text";

const Description = ({ activeScreen, updateScreenData, getFileById }) => {
  const music = getFileById(activeScreen.music);

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="screen-video-textfield-title"
                label="Název"
                defaultValue={activeScreen.title}
                onChange={(value) => updateScreenData({ title: value })}
              />
              <HelpIcon label={helpIconText.EDITOR_DESCRIPTION_TITLE} />
            </div>

            <WysiwygEditor
              controlType="uncontrolled"
              defaultValue={activeScreen.text ?? ""}
              onChange={(newContent) => {
                updateScreenData({ text: newContent });
              }}
            />
          </div>
          <div className="part margin-bottom margin-horizontal">
            <Music
              {...{
                aloneScreen: activeScreen.aloneScreen,
                music,
                updateScreenData,
                muteChapterMusic: activeScreen.muteChapterMusic,
              }}
            />
            <div className="row">
              <Checkbox
                id="screen-video-checkbox-screencompleted"
                name="simple-checkboxes"
                label="Obrazovka je dokončená"
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={(value) =>
                  updateScreenData({ screenCompleted: value })
                }
                className="checkbox-shift-left-by-padding"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { getFileById })(Description);
