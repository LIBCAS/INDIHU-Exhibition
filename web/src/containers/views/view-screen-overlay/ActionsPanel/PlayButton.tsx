import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { BasicTooltip } from "components/tooltip/tooltip";

import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import cx from "classnames";

// - -

type PlayButtonProps = {
  shouldIncrement: boolean;
  play: () => void;
  pause: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const PlayButton = ({
  shouldIncrement,
  play,
  pause,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: PlayButtonProps) => {
  return (
    <>
      <div
        {...bind("play")}
        className={cx(
          "pointer-events-auto",
          isAnyTutorialOpened &&
            (!isTutorialOpen || step?.stepKey !== "play") &&
            "bg-black opacity-40"
        )}
        data-tooltip-id="overlay-play-button-tooltip"
      >
        <Button color="expoTheme" onClick={shouldIncrement ? pause : play}>
          <Icon name={shouldIncrement ? "pause" : "play_arrow"} />
        </Button>
      </div>

      <BasicTooltip
        id="overlay-play-button-tooltip"
        content={shouldIncrement ? "Pozastavit výstavu" : "Přehrát výstavu"}
      />
    </>
  );
};

export default PlayButton;
