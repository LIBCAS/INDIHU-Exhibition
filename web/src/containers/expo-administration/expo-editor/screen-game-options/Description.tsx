import { useDispatch } from "react-redux";

import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import Music from "components/editors/music";
import HelpIcon from "components/help-icon";

import { AppDispatch } from "store/store";
import { GameQuizScreen } from "models";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { helpIconText } from "enums/text";

type DescriptionProps = {
  activeScreen: GameQuizScreen;
};

const Description = (props: DescriptionProps) => {
  const { activeScreen } = props;
  const dispatch = useDispatch<AppDispatch>();

  const musicFile = dispatch(getFileById(activeScreen.music));

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="game-options-textfield-name"
                label="Název"
                defaultValue={activeScreen?.title ?? ""}
                onChange={(newTitle: string) =>
                  updateScreenData({ title: newTitle })
                }
              />
              <HelpIcon
                label={helpIconText.EDITOR_GAME_TITLE}
                id="editor-game-options-title"
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="game-options-textfield-task"
                label="Otázka"
                defaultValue={activeScreen?.task ?? ""}
                onChange={(newTask: string) =>
                  updateScreenData({ task: newTask })
                }
              />
              <HelpIcon
                label={helpIconText.EDITOR_GAME_OPTIONS_TASK}
                id="editor-game-options-task"
              />
            </div>
          </div>
          <div className="part margin-bottom margin-horizontal">
            <Music
              aloneScreen={activeScreen.aloneScreen}
              musicFile={musicFile}
              muteChapterMusic={!!activeScreen.muteChapterMusic}
              helpIconTitle={helpIconText.EDITOR_DESCRIPTION_MUSIC}
              id="editor-game-options-music"
            />
            <div className="row">
              <Checkbox
                id="game-options-checkbox-screencompleted"
                name="simple-checkboxes"
                label="Obrazovka je dokončená"
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={(newValue: boolean) =>
                  updateScreenData({ screenCompleted: newValue })
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

export default Description;
