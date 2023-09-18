import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import cx from "classnames";

type AudioButtonProps = {
  hasAudio: boolean;
  isAudioMuted: boolean;
  openAudioDialog: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const AudioButton = ({
  hasAudio,
  isAudioMuted,
  openAudioDialog,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: AudioButtonProps) => {
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
