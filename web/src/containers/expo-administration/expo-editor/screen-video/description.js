import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import HelpIcon from "components/help-icon";
import Music from "components/editors/music";
import WysiwygEditor from "components/editors/WysiwygEditor/WysiwygEditor";

import { getFileById } from "actions/file-actions";

const Description = ({ activeScreen, updateScreenData, getFileById }) => {
  const { t } = useTranslation("expo-editor");
  const music = getFileById(activeScreen.music);

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="screen-video-textfield-title"
                label={t("descFields.name")}
                defaultValue={activeScreen.title}
                onChange={(value) => updateScreenData({ title: value })}
              />
              <HelpIcon label={t("descFields.nameTooltip")} />
            </div>

            <WysiwygEditor
              controlType="uncontrolled"
              defaultValue={activeScreen.text ?? ""}
              onChange={(newContent) => {
                updateScreenData({ text: newContent });
              }}
            />
          </div>
          <div className="part margin-bottom margin-horizontal">
            <Music
              {...{
                aloneScreen: activeScreen.aloneScreen,
                music,
                updateScreenData,
                muteChapterMusic: activeScreen.muteChapterMusic,
              }}
            />
            <div className="row">
              <Checkbox
                id="screen-video-checkbox-screencompleted"
                name="simple-checkboxes"
                label={t("descFields.screenCompleted")}
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

export default connect(null, { getFileById })(Description);
