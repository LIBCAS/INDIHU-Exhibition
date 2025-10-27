import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import HelpIcon from "components/help-icon";
import { MuteChapterMusicCheckbox } from "components/editors/Checkboxes";

// Types
import { AppDispatch } from "store/store";
import { SurveyScreen } from "models";

// Actions
import { updateScreenData } from "actions/expoActions";

// - - - - - -

type SurveyProps = {
  activeScreen: SurveyScreen;
};

const Description = ({ activeScreen }: SurveyProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="survey-textfield-name"
                label={t("nameLabel")}
                defaultValue={activeScreen.title ?? ""}
                onChange={(newTitle: string) =>
                  dispatch(updateScreenData({ title: newTitle }))
                }
              />
              <HelpIcon
                id="survey-textfield-name-help"
                label={t("nameTooltip")}
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="survey-textfield-task"
                label={t("taskLabel")}
                defaultValue={activeScreen?.task ?? ""}
                onChange={(newTask: string) =>
                  dispatch(updateScreenData({ task: newTask }))
                }
              />
              <HelpIcon
                id="survey-textfield-task-help"
                label={t("taskTooltip")}
              />
            </div>
          </div>

          <div className="part margin-bottom margin-horizontal">
            <MuteChapterMusicCheckbox
              muteChapterMusicValue={activeScreen.muteChapterMusic ?? false}
            />
            <div className="row">
              <Checkbox
                id="survey-checkbox-screenCompleted"
                name="simple-checkboxes"
                label={t("screenCompleted")}
                checked={activeScreen.screenCompleted ?? false}
                value={activeScreen.screenCompleted ?? false}
                onChange={(newValue: boolean) =>
                  dispatch(updateScreenData({ screenCompleted: newValue }))
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
