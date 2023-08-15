import { useDispatch } from "react-redux";

// Components
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import HelpIcon from "../../../components/help-icon";
import CharacterCount from "../../../components/editors/character-count";
import AudioMusic from "../../../components/editors/audio-music";
import Time from "components/editors/time";

// Models
import { ScreenPhotoGalleryProps } from "containers/editors/screen-photogallery/screen-photogallery-new";
import { AppDispatch } from "store/store";
import { File as IndihuFile } from "models";

// Utils
import { getFileById } from "actions/file-actions";
import { helpIconText } from "enums/text";

// - -

const Description = (props: ScreenPhotoGalleryProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { activeScreen, updateScreenData } = props;
  const audio = dispatch(getFileById(props.activeScreen.audio)) as IndihuFile;

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          {/* Left column with Title and Text */}
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="screen-photogallery-new-textfield-title"
                label="Název"
                defaultValue={activeScreen.title}
                onChange={(newTitle: string) =>
                  updateScreenData({ title: newTitle })
                }
              />
              <HelpIcon label={helpIconText.EDITOR_DESCRIPTION_TITLE} />
            </div>

            <div className="flex-row-nowrap">
              <TextField
                id="screen-photogallery-new-textfield-text"
                label="Text k tématu"
                rows={5}
                defaultValue={activeScreen.text ?? ""}
                onChange={(newText: string) =>
                  updateScreenData({ text: newText })
                }
              />
              <HelpIcon label={helpIconText.EDITOR_DESCRIPTION_TEXT} />
            </div>
            <CharacterCount text={activeScreen.text} />
          </div>

          {/* Right column with Audio + checkboxes */}
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              isAudio
              audio={audio}
              updateScreenData={updateScreenData}
              helpIconTitle={helpIconText.EDITOR_DESCRIPTION_AUDIO}
              id="editor-photogallery-description-audio"
            />

            <Time
              audio={audio}
              activeScreen={activeScreen}
              updateScreenData={updateScreenData}
            />

            <div className="row">
              <Checkbox
                id="editor-photogallery-checkbox-chapter-music"
                label="Vypnout zvukovou stopu kapitoly"
                checked={activeScreen.muteChapterMusic ?? false}
                onChange={(newValue: boolean) =>
                  updateScreenData({ muteChapterMusic: newValue })
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
