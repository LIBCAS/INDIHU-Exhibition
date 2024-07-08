import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// Components
import { TitleTextField } from "components/editors/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import AudioMusic from "components/editors/audio-music";
import Time from "components/editors/time";
import WysiwygEditor from "components/editors/WysiwygEditor/WysiwygEditor";

// Models
import { ScreenEditorPhotogalleryProps } from "./screen-photogallery-new";
import { AppDispatch } from "store/store";
import { File as IndihuFile } from "models";

// Utils
import { getFileById } from "actions/file-actions";
import {
  saveScreen,
  updateScreenData,
} from "actions/expoActions/screen-actions";
import { wrapTextInParagraph } from "components/editors/WysiwygEditor/utils";

// - -

type DescriptionProps = ScreenEditorPhotogalleryProps & {
  rowNum: string | undefined;
  colNum: string | undefined;
};

const Description = (props: DescriptionProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  const { activeScreen, rowNum, colNum } = props;
  const audio = dispatch(getFileById(props.activeScreen.audio)) as IndihuFile;

  const text = activeScreen.text ?? "";

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          {/* Left column with Title and Text */}
          <div className="part margin-bottom margin-horizontal">
            <TitleTextField titleValue={activeScreen.title ?? ""} />
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

          {/* Right column with Audio + checkboxes */}
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              isAudio
              audio={audio}
              helpIconTitle={t("descFields.audioScreenTrackTooltip")}
              id="editor-photogallery-description-audio"
            />

            <Time audio={audio} activeScreen={activeScreen} />

            <div className="row">
              <Checkbox
                id="editor-photogallery-checkbox-chapter-music"
                label={t("descFields.musicTurnOff")}
                checked={activeScreen.muteChapterMusic ?? false}
                onChange={(newValue: boolean) =>
                  dispatch(updateScreenData({ muteChapterMusic: newValue }))
                }
                className="checkbox-shift-left-by-padding"
              />
            </div>

            <div className="row">
              <Checkbox
                id="editor-photogallery-checkbox-screencompleted"
                label={t("descFields.screenCompleted")}
                checked={activeScreen.screenCompleted ?? false}
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
