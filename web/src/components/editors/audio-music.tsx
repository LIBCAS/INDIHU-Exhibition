import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";

import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "../help-icon";

import { File as IndihuFile } from "models";

import { DialogType } from "components/dialogs/dialog-types";
import { setDialog } from "../../actions/dialog-actions";
import { updateScreenData } from "actions/expoActions/screen-actions";
import { helpIconText } from "../../enums/text";

type AudioMusicProps = {
  isAudio: boolean; // whether music or audio is supplied
  audio?: IndihuFile | null;
  music?: IndihuFile | null;
  id: string;
  helpIconTitle: string;
  textFieldLabel?: string;
};

const AudioMusic = ({
  isAudio,
  audio,
  music,
  textFieldLabel,
  id,
  helpIconTitle,
}: AudioMusicProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  return (
    <div className="row flex-centered">
      <TextField
        id={`editor-${isAudio ? "audio" : "music"}-textfield-music`}
        label={
          textFieldLabel
            ? textFieldLabel
            : isAudio
            ? t("descFields.audioScreenTrack")
            : t("descFields.audioChapterTrack")
        }
        value={audio ? audio.name : music ? music.name : ""}
        disabled
      />
      <div className="row flex-centered">
        {((isAudio && audio) || music) && (
          <FontIcon
            className="icon"
            onClick={() =>
              dispatch(
                setDialog(DialogType.ConfirmDialog, {
                  title: <FontIcon className="color-black">delete</FontIcon>,
                  text: `Opravdu chcete odstranit zvukovou stopu ${
                    isAudio ? "obrazovky" : "kapitoly"
                  }?`,
                  onSubmit: () =>
                    isAudio
                      ? dispatch(
                          updateScreenData({ audio: null, timeAuto: undefined })
                        )
                      : dispatch(updateScreenData({ music: null })),
                })
              )
            }
          >
            delete
          </FontIcon>
        )}

        <Button
          raised
          label={t("descFields.audioSelectLabel")}
          onClick={() =>
            dispatch(
              setDialog(DialogType.ScreenFileChoose, {
                onChoose: isAudio
                  ? (audio) =>
                      dispatch(
                        updateScreenData({
                          audio: audio.id,
                          timeAuto: !!audio.duration,
                          time: audio.duration ? audio.duration + 2 : 0,
                        })
                      )
                  : (music) => dispatch(updateScreenData({ music: music.id })),
                typeMatch: new RegExp(/^audio\/.*$/),
                accept: "audio/*",
              })
            )
          }
        />
        <HelpIcon
          label={
            helpIconTitle
              ? helpIconTitle
              : isAudio
              ? helpIconText.EDITOR_AUDIO
              : helpIconText.EDITOR_MUSIC
          }
          id={id}
        />
      </div>
    </div>
  );
};

export default AudioMusic;
