import React from "react";
import { connect } from "react-redux";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import HelpIcon from "../HelpIcon";
import Music from "./Music";
import AudioMusic from "./AudioMusic";
import Time from "./Time";
import CharacterCount from "./CharacterCount";

import { setDialog } from "../../actions/dialogActions";
import { getFileById } from "../../actions/fileActions";

import { helpIconText } from "../../enums/text";

const Description = ({
  activeScreen,
  updateScreenData,
  setDialog,
  getFileById
}) => {
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
                onChange={value => updateScreenData({ title: value })}
              />
              <HelpIcon {...{ label: helpIconText.EDITOR_DESCRIPTION_TITLE }} />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="editor-description-textfield-text"
                label="Text k tématu"
                defaultValue={activeScreen.text}
                onChange={value => updateScreenData({ text: value })}
                rows={5}
              />
              <HelpIcon {...{ label: helpIconText.EDITOR_DESCRIPTION_TEXT }} />
            </div>
            <CharacterCount {...{ text: activeScreen.text }} />
          </div>
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              {...{
                isAudio: true,
                audio,
                updateScreenData
              }}
            />
            <Time {...{ audio, activeScreen, updateScreenData }} />
            <Music
              {...{
                aloneScreen: activeScreen.aloneScreen,
                music,
                updateScreenData,
                muteChapterMusic: activeScreen.muteChapterMusic
              }}
            />
            <div className="row flex-centered">
              <Checkbox
                id="editor-description-checkbox-screencompleted"
                name="simple-checkboxes"
                label="Obrazovka je dokončená"
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={value => updateScreenData({ screenCompleted: value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { setDialog, getFileById })(Description);
