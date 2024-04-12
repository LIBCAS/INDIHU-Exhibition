import { useDispatch } from "react-redux";

import {
  GameResultTimeTextField,
  GameTaskTextField,
  GameTitleTextField,
} from "./TextFields";
import { ScreenCompletedCheckbox } from "./Checkboxes";
import Music from "./music";

import { AppDispatch } from "store/store";
import { Screen } from "models";

import { getFileById } from "actions/file-actions-typed";
import { helpIconText } from "enums/text";

// - -

type GameDescriptionProps = {
  activeScreen: Screen;
  taskHelpIconLabel: string;
};

const GameDescription = ({
  activeScreen,
  taskHelpIconLabel,
}: GameDescriptionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const musicFile =
    "music" in activeScreen ? dispatch(getFileById(activeScreen.music)) : null;

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <GameTitleTextField gameTitleValue={activeScreen.title ?? ""} />
            <GameTaskTextField
              taskValue={
                "task" in activeScreen && activeScreen.task
                  ? activeScreen.task
                  : ""
              }
              taskHelpIconLabel={taskHelpIconLabel}
            />
          </div>

          <div className="part margin-bottom margin-horizontal">
            <GameResultTimeTextField
              resultTimeValue={
                "resultTime" in activeScreen ? activeScreen.resultTime ?? 4 : 4
              }
            />

            <Music
              aloneScreen={
                "aloneScreen" in activeScreen
                  ? !!activeScreen.aloneScreen
                  : false
              }
              muteChapterMusic={
                "muteChapterMusic" in activeScreen
                  ? !!activeScreen.muteChapterMusic
                  : false
              }
              musicFile={musicFile}
              helpIconTitle={helpIconText.EDITOR_DESCRIPTION_MUSIC}
              id="editor-game-description-music"
            />

            <ScreenCompletedCheckbox
              screenCompletedValue={
                "screenCompleted" in activeScreen
                  ? !!activeScreen.screenCompleted
                  : false
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDescription;
