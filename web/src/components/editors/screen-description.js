import { connect } from "react-redux";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import HelpIcon from "../help-icon";
import Music from "./music";
import AudioMusic from "./audio-music";
import Time from "./time";
import CharacterCount from "./character-count";

import { setDialog } from "../../actions/dialog-actions";
import { getFileById } from "../../actions/file-actions";

import { helpIconText } from "../../enums/text";

const Description = ({ activeScreen, updateScreenData, getFileById }) => {
  const audio = getFileById(activeScreen.audio);
  const music = getFileById(activeScreen.music);

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="editor-description-textfield-title"
                label="Název"
                defaultValue={activeScreen.title}
                onChange={(value) => updateScreenData({ title: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_DESCRIPTION_TITLE,
                  id: "editor-description-title",
                }}
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="editor-description-textfield-text"
                label="Text k tématu"
                defaultValue={activeScreen.text}
                onChange={(value) => updateScreenData({ text: value })}
                rows={5}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_DESCRIPTION_TEXT,
                  id: "editor-description-text",
                }}
              />
            </div>
            <CharacterCount {...{ text: activeScreen.text }} />
          </div>
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              {...{
                isAudio: true,
                audio,
                updateScreenData,
                helpIconTitle: helpIconText.EDITOR_DESCRIPTION_AUDIO,
                id: "editor-description-audio",
              }}
            />
            <Time {...{ audio, activeScreen, updateScreenData }} />
            <Music
              {...{
                aloneScreen: activeScreen.aloneScreen,
                music,
                updateScreenData,
                muteChapterMusic: activeScreen.muteChapterMusic,
                helpIconTitle: helpIconText.EDITOR_DESCRIPTION_MUSIC,
                id: "editor-description-music",
              }}
            />
            <div className="row">
              <Checkbox
                id="editor-description-checkbox-screencompleted"
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

export default connect(null, { setDialog, getFileById })(Description);
