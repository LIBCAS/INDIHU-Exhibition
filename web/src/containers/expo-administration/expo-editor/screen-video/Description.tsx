import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import HelpIcon from "components/help-icon";
import Music from "components/editors/music";
import WysiwygEditor from "components/editors/WysiwygEditor/WysiwygEditor";

// Models
import { VideoScreen } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { saveScreen, updateScreenData } from "actions/expoActions";
import { wrapTextInParagraph } from "components/editors/WysiwygEditor/utils";

// - -

type DescriptionProps = {
  activeScreen: VideoScreen;
  rowNum: string | undefined;
  colNum: string | undefined;
};

const Description = ({ activeScreen, rowNum, colNum }: DescriptionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  const music = dispatch(getFileById(activeScreen.music));

  const text = activeScreen.text ?? "";

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
                onChange={(newTitle: string) =>
                  dispatch(updateScreenData({ title: newTitle }))
                }
              />
              <HelpIcon label={t("descFields.nameTooltip")} />
            </div>

            <WysiwygEditor
              controlType="uncontrolled"
              defaultValue={text}
              onChange={(newText: string) => {
                const wrappedOldText = wrapTextInParagraph(text.trimEnd());
                dispatch(updateScreenData({ text: newText }));

                // NOTE: Additional check
                // Means that the new text is just wrapped old text
                // We do not want this change to act as a change done from user, so immediately save it
                if (newText === wrappedOldText) {
                  dispatch(saveScreen(activeScreen, rowNum, colNum));
                }
              }}
            />
          </div>
          <div className="part margin-bottom margin-horizontal">
            <Music
              id="video-screen-music"
              helpIconTitle=""
              aloneScreen={activeScreen.aloneScreen}
              musicFile={music}
              muteChapterMusic={activeScreen.muteChapterMusic}
            />
            <div className="row">
              <Checkbox
                id="screen-video-checkbox-screencompleted"
                name="simple-checkboxes"
                label={t("descFields.screenCompleted")}
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={(value: boolean) =>
                  dispatch(updateScreenData({ screenCompleted: value }))
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
