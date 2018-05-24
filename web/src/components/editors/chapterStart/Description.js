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
              <HelpIcon {...{ label: helpIconText.EDITOR_DESCRIPTION_TITLE }} />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="chapter-start-textfield-subtitle"
                label="Podnázev"
                defaultValue={activeScreen.subTitle}
                onChange={value => updateScreenData({ subTitle: value })}
              />
              <HelpIcon
                {...{ label: helpIconText.EDITOR_DESCRIPTION_SUBTITLE }}
              />
            </div>
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
            <AudioMusic
              {...{
                music,
                updateScreenData
              }}
            />
            <div className="row flex-centered">
              <Checkbox
                id="chapter-start-checkbox-screencompleted"
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
