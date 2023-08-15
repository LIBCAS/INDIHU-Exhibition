import useElementSize from "hooks/element-size-hook";

import SettingsButton from "./SettingsButton";
import GlassMagnifierButton from "./GlassMagnifierButton/GlassMagnifierButton";
import PlayButton from "./PlayButton";
import AudioButton from "./AudioButton";
import ChaptersButtonContainer from "./ChaptersButtonContainer";

import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";

// - -

type ActionsPanelProps = {
  isScreenAudioPresent: boolean;
  isChapterMusicPresent: boolean;
  play: () => void;
  pause: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const ActionsPanel = ({
  isScreenAudioPresent,
  isChapterMusicPresent,
  play,
  pause,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: ActionsPanelProps) => {
  const [actionsBoxRef, actionsBoxSize] = useElementSize();

  return (
    <div
      className={cx(
        classes.actions,
        "flex items-end justify-end p-3 gap-2 h-full"
      )}
      ref={actionsBoxRef}
    >
      {/* 2b1) Settings button opening settings dialog */}
      <SettingsButton isAnyTutorialOpened={isAnyTutorialOpened} />

      <GlassMagnifierButton />

      {/* 2b2 - Play / pause button, ALWAYS rendered */}
      <PlayButton
        play={play}
        pause={pause}
        bind={bind}
        isTutorialOpen={isTutorialOpen}
        isAnyTutorialOpened={isAnyTutorialOpened}
        step={step}
      />

      {/* 2b3 - Audio button opening audio dialog, CONDITIONAL rendered */}
      <AudioButton
        // isScreenAudioPresent={audioRef.current !== null}
        // isChapterMusicPresent={chapterMusicRef.current !== null}
        isScreenAudioPresent={isScreenAudioPresent}
        isChapterMusicPresent={isChapterMusicPresent}
        bind={bind}
        isTutorialOpen={isTutorialOpen}
        isAnyTutorialOpened={isAnyTutorialOpened}
        step={step}
      />

      {/* 2b5 - Chapters button, ALWAYS rendered */}
      <ChaptersButtonContainer
        bind={bind}
        isTutorialOpen={isTutorialOpen}
        isAnyTutorialOpened={isAnyTutorialOpened}
        step={step}
        actionsBoxSize={actionsBoxSize}
      />
    </div>
  );
};

export default ActionsPanel;
