import { connect } from "react-redux";
import { compose, withState } from "recompose";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import Music from "./music";
import HelpIcon from "../help-icon";

import { getFileById } from "../../actions/file-actions";

import { helpIconText } from "../../enums/text";

const Description = ({
  activeScreen,
  updateScreenData,
  getFileById,
  taskHelpIconLabel,
  error,
  setError,
}) => {
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
                onChange={(value) => updateScreenData({ title: value })}
              />
              <HelpIcon
                label={helpIconText.EDITOR_GAME_TITLE}
                id="editor-game-title"
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="game-textfield-task"
                label="Úkol minihry"
                defaultValue={activeScreen.task}
                onChange={(value) => updateScreenData({ task: value })}
              />
              <HelpIcon label={taskHelpIconLabel} id="editor-game-task" />
            </div>
          </div>
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <div className="full-width">
                <div className="form-input form-input-with-suffix">
                  <TextField
                    id="game-textfield-result-time"
                    label="Doba zobrazení výsledku"
                    defaultValue={activeScreen.resultTime}
                    onChange={(value) => {
                      const numberValue = Number(value);
                      const ok =
                        !numberValue ||
                        isNaN(numberValue) ||
                        numberValue < 1 ||
                        numberValue > 1000000;
                      setError(
                        ok ? "Zadejte číslo v rozsahu 1 až 1000000." : null
                      );
                      updateScreenData({
                        resultTime: numberValue,
                      });
                    }}
                    type="number"
                  />
                  <span className="form-input-suffix">vteřin</span>
                </div>
                {error && (
                  <div>
                    <span className="invalid">{error}</span>
                  </div>
                )}
              </div>
              <HelpIcon
                label={helpIconText.EDITOR_GAME_RESULT_TIME}
                id="editor-game-result-time"
              />
            </div>
            <Music
              {...{
                aloneScreen: activeScreen.aloneScreen,
                music,
                updateScreenData,
                muteChapterMusic: activeScreen.muteChapterMusic,
                helpIconTitle: helpIconText.EDITOR_DESCRIPTION_MUSIC,
                id: "editor-game-description-music",
              }}
            />
            <div className="row">
              <Checkbox
                id="game-checkbox-screencompleted"
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

export default compose(
  connect(null, { getFileById }),
  withState("error", "setError", null)
)(Description);
