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
import { updateScreenData } from "actions/expoActions/screen-actions-typed";
import { helpIconText } from "enums/text";

// - -

const Description = (props: ScreenEditorPhotogalleryProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { activeScreen } = props;
  const audio = dispatch(getFileById(props.activeScreen.audio)) as IndihuFile;

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          {/* Left column with Title and Text */}
          <div className="part margin-bottom margin-horizontal">
            <TitleTextField titleValue={activeScreen.title ?? ""} />
            <WysiwygEditor
              controlType="uncontrolled"
              defaultValue={activeScreen.text ?? ""}
              onChange={(newContent: string) => {
                dispatch(updateScreenData({ text: newContent }));
              }}
            />
          </div>

          {/* Right column with Audio + checkboxes */}
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              isAudio
              audio={audio}
              helpIconTitle={helpIconText.EDITOR_DESCRIPTION_AUDIO}
              id="editor-photogallery-description-audio"
            />

            <Time audio={audio} activeScreen={activeScreen} />

            <div className="row">
              <Checkbox
                id="editor-photogallery-checkbox-chapter-music"
                label="Vypnout zvukovou stopu kapitoly"
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
                label="Obrazovka je dokončená"
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
