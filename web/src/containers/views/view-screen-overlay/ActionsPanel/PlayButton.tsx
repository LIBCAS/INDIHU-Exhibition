import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { AppState } from "store/store";

import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import cx from "classnames";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (shouldIncrement) => ({ shouldIncrement })
);

type PlayButtonProps = {
  play: () => void;
  pause: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const PlayButton = ({
  play,
  pause,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: PlayButtonProps) => {
  const { shouldIncrement } = useSelector(stateSelector);

  return (
    <div
      {...bind("play")}
      className={cx(
        "pointer-events-auto",
        isAnyTutorialOpened &&
          (!isTutorialOpen || step?.stepKey !== "play") &&
          "bg-black opacity-40"
      )}
    >
      <Button color="expoTheme" onClick={shouldIncrement ? pause : play}>
        <Icon name={shouldIncrement ? "pause" : "play_arrow"} />
      </Button>
    </div>
  );
};

export default PlayButton;
