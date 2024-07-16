import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { TitleTextField } from "./TextFields";
import Music from "./music";
import AudioMusic from "./audio-music";
import Time from "./time";
import WysiwygEditor from "./WysiwygEditor/WysiwygEditor";

import { Screen } from "models";
import { AppDispatch } from "store/store";

import { getFileById } from "actions/file-actions-typed";
import { saveScreen, updateScreenData } from "actions/expoActions";
import { helpIconText } from "enums/text";
import { ScreenCompletedCheckbox } from "./Checkboxes";
import { wrapTextInParagraph } from "./WysiwygEditor/utils";

type ScreenDescriptionProps = {
  activeScreen: Screen;
  rowNum: string | undefined;
  colNum: string | undefined;
  sumOfPhotosTimes?: number | null; // in case of slideshow description
  totalZoomScreenTime?: number;
};

const ScreenDescription = ({
  activeScreen,
  rowNum,
  colNum,
  sumOfPhotosTimes,
  totalZoomScreenTime,
}: ScreenDescriptionProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  const text =
    "text" in activeScreen && activeScreen.text ? activeScreen.text : "";

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
            <AudioMusic
              isAudio={true}
              audio={audioFile}
              helpIconTitle={t("descFields.audioScreenTrackTooltip")}
              id="editor-description-audio"
            />

            {activeScreen.type === "IMAGE_ZOOM" && (
              <div className="mt-4 mb-3 flex gap-2 text-lg">
                <div>{t("descFields.imageZoomScreen.totalScreenTime")}</div>
                <div>
                  {totalZoomScreenTime}{" "}
                  {t("descFields.imageZoomScreen.seconds")}
                </div>
              </div>
            )}

            {activeScreen.type !== "IMAGE_ZOOM" && (
              <Time
                audio={audioFile}
                activeScreen={activeScreen}
                sumOfPhotosTimes={sumOfPhotosTimes}
                helpIconLabel={t("descFields.screenTimeTooltip")}
                helpIconId="time-help-icon"
              />
            )}

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
