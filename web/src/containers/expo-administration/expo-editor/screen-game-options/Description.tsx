import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import HelpIcon from "components/help-icon";
import { MuteChapterMusicCheckbox } from "components/editors/Checkboxes";
import ScreenBackgroundColorPicker from "components/editors/screen-background-color-picker";

// Types
import { AppDispatch } from "store/store";
import { GameQuizScreen } from "models";

// Utils
import { updateScreenData } from "actions/expoActions";

// - - - - - -

type DescriptionProps = {
  activeScreen: GameQuizScreen;
};

const Description = (props: DescriptionProps) => {
  const { activeScreen } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="game-options-textfield-name"
                label={t("descFields.gameQuizScreen.nameLabel")}
                defaultValue={activeScreen?.title ?? ""}
                onChange={(newTitle: string) =>
                  dispatch(updateScreenData({ title: newTitle }))
                }
              />
              <HelpIcon
                label={t("descFields.gameQuizScreen.nameTooltip")}
                id="editor-game-options-title"
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="game-options-textfield-task"
                label={t("descFields.gameQuizScreen.taskLabel")}
                defaultValue={activeScreen?.task ?? ""}
                onChange={(newTask: string) =>
                  dispatch(updateScreenData({ task: newTask }))
                }
              />
              <HelpIcon
                label={t("descFields.gameQuizScreen.taskTooltip")}
                id="editor-game-options-task"
              />
            </div>
          </div>

          <div className="part margin-bottom margin-horizontal">
            <MuteChapterMusicCheckbox
              muteChapterMusicValue={!!activeScreen.muteChapterMusic}
            />
            <div className="row">
              <Checkbox
                id="game-options-checkbox-screencompleted"
                name="simple-checkboxes"
                label={t("descFields.gameQuizScreen.screenCompleted")}
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={(newValue: boolean) =>
                  dispatch(updateScreenData({ screenCompleted: newValue }))
                }
                className="checkbox-shift-left-by-padding"
              />
            </div>

            <ScreenBackgroundColorPicker
              label={t("descFields.screenBackgroundColorLabel")}
              helpText={t("descFields.screenBackgroundColorTooltip")}
              color={
                "screenBgColor" in activeScreen && !!activeScreen.screenBgColor
                  ? activeScreen.screenBgColor
                  : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
