import { useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { AppState } from "store/store";
import { AppDispatch } from "store/store";
import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import cx from "classnames";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.expoVolumes,
  (viewScreen, expoVolumes) => ({ viewScreen, expoVolumes })
);

type AudioButtonProps = {
  isScreenAudioPresent: boolean;
  isChapterMusicPresent: boolean;
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const AudioButton = ({
  isScreenAudioPresent,
  isChapterMusicPresent,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: AudioButtonProps) => {
  const { viewScreen, expoVolumes } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const hasAudio =
    (viewScreen && "audio" in viewScreen && viewScreen.audio) ||
    isChapterMusicPresent ||
    (viewScreen && "video" in viewScreen && viewScreen.video);

  const isAudioMuted = useMemo(
    () =>
      expoVolumes.speechVolume.actualVolume === 0 &&
      expoVolumes.musicVolume.actualVolume === 0,
    [expoVolumes]
  );

  const openAudioDialog = useCallback(() => {
    dispatch(
      setDialog(DialogType.AudioDialog, {
        hasSpeechVolume: isScreenAudioPresent,
        hasMusicVolume: isChapterMusicPresent,
        isVideoPresent:
          (viewScreen && "video" in viewScreen && !!viewScreen.video) ?? false,
      })
    );
  }, [dispatch, isChapterMusicPresent, isScreenAudioPresent, viewScreen]);

  return (
    <>
      {hasAudio && (
        <div
          {...bind("audio")}
          className={cx(
            "pointer-events-auto",
            isAnyTutorialOpened &&
              (!isTutorialOpen || step?.stepKey !== "audio") &&
              "bg-black opacity-40"
          )}
        >
          <Button color="expoTheme" onClick={openAudioDialog}>
            <Icon name={isAudioMuted ? "volume_off" : "volume_up"} />
          </Button>
        </div>
      )}
    </>
  );
};

export default AudioButton;
