import React from "react";
import { connect } from "react-redux";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import AudioMusic from "../AudioMusic";
import Time from "../Time";
import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";

import { helpIconText } from "../../../enums/text";

const Description = ({
  activeScreen,
  updateScreenData,
  setDialog,
  getFileById
}) => {
  const music = getFileById(activeScreen.music);
  const audio = getFileById(activeScreen.audio);

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="chapter-start-textfield-title"
                label="Název"
                defaultValue={activeScreen.title}
                onChange={value => updateScreenData({ title: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_TITLE,
                  id: "editor-chapter-start-description-title"
                }}
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="chapter-start-textfield-subtitle"
                label="Podnázev"
                defaultValue={activeScreen.subTitle}
                onChange={value => updateScreenData({ subTitle: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_SUBTITLE,
                  id: "editor-chapter-start-description-title"
                }}
              />
            </div>
          </div>
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              {...{
                isAudio: true,
                audio,
                updateScreenData,
                helpIconTitle:
                  helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_AUDIO,
                id: "editor-chapter-start-description-audio"
              }}
            />
            <Time {...{ audio, activeScreen, updateScreenData }} />
            <AudioMusic
              {...{
                music,
                updateScreenData,
                helpIconTitle:
                  helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_MUSIC,
                id: "editor-chapter-start-description-music"
              }}
            />
            <div className="row flex-centered">
              <Checkbox
                id="chapter-start-checkbox-screencompleted"
                name="simple-checkboxes"
                label="Stránka je dokončená"
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
