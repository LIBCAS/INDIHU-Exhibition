import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { BasicTooltip } from "components/tooltip/tooltip";

import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import cx from "classnames";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";

type AudioButtonProps = {
  hasAudio: boolean;
  isAudioMuted: boolean;
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const AudioButton = ({
  hasAudio,
  isAudioMuted,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: AudioButtonProps) => {
  const { openNewTopDialog } = useDialogRef();

  if (!hasAudio) {
    return null;
  }

  return (
    <>
      <div
        {...bind("audio")}
        className={cx(
          "pointer-events-auto",
          isAnyTutorialOpened &&
            (!isTutorialOpen || step?.stepKey !== "audio") &&
            "bg-black opacity-40"
        )}
        data-tooltip-id="overlay-audio-button-tooltip"
      >
        <Button
          color="expoTheme"
          onClick={() => openNewTopDialog(DialogRefType.AudioDialog)}
        >
          <Icon name={isAudioMuted ? "volume_off" : "volume_up"} />
        </Button>
      </div>

      <BasicTooltip
        id="overlay-audio-button-tooltip"
        content="Nastavení hlasitosti"
      />
    </>
  );
};

export default AudioButton;
