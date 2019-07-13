import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import Music from "../Music";
import HelpIcon from "../../HelpIcon";

import { getFileById } from "../../../actions/fileActions";
import { updateScreenData } from "../../../actions/expoActions";

import { helpIconText } from "../../../enums/text";

const Description = ({ activeScreen, updateScreenData, getFileById }) => {
  const music = getFileById(activeScreen.music);

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="game-options-textfield-name"
                label="Název"
                defaultValue={activeScreen.title}
                onChange={value => updateScreenData({ title: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_GAME_TITLE,
                  id: "editor-game-options-title"
                }}
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="game-options-textfield-task"
                label="Otázka"
                defaultValue={activeScreen.task}
                onChange={value => updateScreenData({ task: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_GAME_OPTIONS_TASK,
                  id: "editor-game-options-task"
                }}
              />
            </div>
          </div>
          <div className="part margin-bottom margin-horizontal">
            <Music
              {...{
                aloneScreen: activeScreen.aloneScreen,
                music,
                updateScreenData,
                muteChapterMusic: activeScreen.muteChapterMusic,
                helpIconTitle: helpIconText.EDITOR_DESCRIPTION_MUSIC,
                id: "editor-game-options-music"
              }}
            />
            <div className="row">
              <Checkbox
                id="game-options-checkbox-screencompleted"
                name="simple-checkboxes"
                label="Obrazovka je dokončená"
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={value => updateScreenData({ screenCompleted: value })}
                className="checkbox-no-padding-left"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(
    null,
    {
      getFileById,
      updateScreenData
    }
  )
)(Description);
