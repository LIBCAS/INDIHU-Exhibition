import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";

import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import { updateScreenData } from "actions/expoActions";

// - -

type ScreenCompletedCheckboxProps = { screenCompletedValue: boolean };

export const ScreenCompletedCheckbox = ({
  screenCompletedValue,
}: ScreenCompletedCheckboxProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="row">
      <Checkbox
        id="editor-description-checkbox-screencompleted"
        name="simple-checkboxes"
        label={t("descFields.screenCompleted")}
        className="checkbox-shift-left-by-padding"
        checked={screenCompletedValue}
        onChange={(newScreenCompleted: boolean) =>
          dispatch(updateScreenData({ screenCompleted: newScreenCompleted }))
        }
      />
    </div>
  );
};

// - -

type MuteChapterMusicCheckboxProps = { muteChapterMusicValue: boolean };

export const MuteChapterMusicCheckbox = ({
  muteChapterMusicValue,
}: MuteChapterMusicCheckboxProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="row">
      <Checkbox
        id="editor-music-checkbox-chapter-music"
        name="simple-checkboxes"
        label={t("descFields.musicTurnOff")}
        className="checkbox-shift-left-by-padding"
        checked={muteChapterMusicValue}
        onChange={(newMuteChapterMusic: boolean) =>
          dispatch(updateScreenData({ muteChapterMusic: newMuteChapterMusic }))
        }
      />
    </div>
  );
};
