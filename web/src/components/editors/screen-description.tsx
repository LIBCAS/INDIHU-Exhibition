import { useDispatch } from "react-redux";

import { TitleTextField } from "./TextFields";
import Music from "./music";
import AudioMusic from "./audio-music";
import Time from "./time";
import WysiwygEditor from "./WysiwygEditor/WysiwygEditor";

import { Screen } from "models";
import { AppDispatch } from "store/store";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { helpIconText } from "enums/text";
import { ScreenCompletedCheckbox } from "./Checkboxes";

type ScreenDescriptionProps = {
  activeScreen: Screen;
  sumOfPhotosTimes?: number | null; // in case of slideshow description
};

const ScreenDescription = ({
  activeScreen,
  sumOfPhotosTimes,
}: ScreenDescriptionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const audioFile =
    "audio" in activeScreen && activeScreen.audio
      ? dispatch(getFileById(activeScreen.audio))
      : null;

  const musicFile =
    "music" in activeScreen && activeScreen.music
      ? dispatch(getFileById(activeScreen.music))
      : null;

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <TitleTextField titleValue={activeScreen.title ?? ""} />
            <WysiwygEditor
              controlType="uncontrolled"
              defaultValue={
                "text" in activeScreen && activeScreen.text
                  ? activeScreen.text
                  : ""
              }
              onChange={(newContent: string) => {
                dispatch(updateScreenData({ text: newContent }));
              }}
            />
          </div>
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              isAudio={true}
              audio={audioFile}
              helpIconTitle={helpIconText.EDITOR_DESCRIPTION_AUDIO}
              id="editor-description-audio"
            />

            <Time
              audio={audioFile}
              activeScreen={activeScreen}
              sumOfPhotosTimes={sumOfPhotosTimes}
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
              id="editor-description-music"
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

export default ScreenDescription;
