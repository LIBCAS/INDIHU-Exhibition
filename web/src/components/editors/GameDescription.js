import React from "react";
import { connect } from "react-redux";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import Music from "./Music";
import HelpIcon from "../HelpIcon";

import { getFileById } from "../../actions/fileActions";

import { helpIconText } from "../../enums/text";

const Description = ({ activeScreen, updateScreenData, getFileById }) => {
  const music = getFileById(activeScreen.music);

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="game-textfield-name"
                label="Název"
                defaultValue={activeScreen.title}
                onChange={value => updateScreenData({ title: value })}
              />
              <HelpIcon {...{ label: helpIconText.EDITOR_GAME_TITLE }} />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="game-textfield-task"
                label="Úkol minihry"
                defaultValue={activeScreen.task}
                onChange={value => updateScreenData({ task: value })}
              />
              <HelpIcon {...{ label: helpIconText.EDITOR_GAME_TASK }} />
            </div>
          </div>
          <div className="part margin-bottom margin-horizontal">
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
                id="game-checkbox-screencompleted"
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

export default connect(null, { getFileById })(Description);
