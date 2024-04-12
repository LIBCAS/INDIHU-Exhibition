import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import {
  TutorialKey,
  useTutorialStore,
} from "context/tutorial-provider/tutorial-provider";

// Components
import { Popper } from "components/popper/popper";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { AppState } from "store/store";
import { Screen } from "models";
import { screenType } from "enums/screen-type";
import { RefCallback } from "context/tutorial-provider/use-tutorial";

// Utils
import cx from "classnames";
import TutorialContentBody from "context/tutorial-provider/TutorialContentBody";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  (viewScreen) => ({ viewScreen })
);

// - -

const getFirstGameTutorialStepKey = (
  viewScreen: Screen | null
): TutorialKey | null => {
  if (!viewScreen) {
    return null;
  }

  if (viewScreen.type === screenType.GAME_DRAW) {
    return "gameDraw";
  }
  if (viewScreen.type === screenType.GAME_FIND) {
    return "gameFind";
  }
  if (viewScreen.type === screenType.GAME_MOVE) {
    return "gameMove";
  }
  if (viewScreen.type === screenType.GAME_OPTIONS) {
    return "gameOptions";
  }
  if (viewScreen.type === screenType.GAME_SIZING) {
    return "gameSizing";
  }
  if (viewScreen.type === screenType.GAME_WIPE) {
    return "gameWipe";
  }

  return null;
};

// - -

type HelpButtonProps = {
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const HelpButton = ({
  bind,
  getTutorialEclipseClassnameByStepkeys,
}: HelpButtonProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { store } = useTutorialStore();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isHelpTutorialOpen, setIsHelpTutorialOpen] = useState<boolean>(false);

  // - -

  const gameTutorialKey = useMemo(
    () => getFirstGameTutorialStepKey(viewScreen),
    [viewScreen]
  );

  const gameTutorialStep = useMemo(() => {
    if (!gameTutorialKey) {
      return null;
    }
    return store[gameTutorialKey].steps[0];
  }, [gameTutorialKey, store]);

  // - -

  return (
    <>
      <div
        ref={containerRef}
        className={cx(
          "pointer-events-auto",
          getTutorialEclipseClassnameByStepkeys(["help-tutorial-button"])
        )}
      >
        <div {...bind("help-tutorial-button")}>
          <Button
            color="expoTheme"
            onClick={() => setIsHelpTutorialOpen((prev) => !prev)}
          >
            <Icon name="help" />
          </Button>
        </div>
      </div>

      {/*  */}
      {gameTutorialStep && (
        <Popper
          open={isHelpTutorialOpen}
          anchor={containerRef.current}
          arrow
          placement="auto"
        >
          <TutorialContentBody
            currStepObj={gameTutorialStep}
            currStepIndex={0}
            numberOfSteps={1}
            nextTutorialStep={() => setIsHelpTutorialOpen(false)}
            skipTutorial={() => setIsHelpTutorialOpen(false)}
          />
        </Popper>
      )}
    </>
  );
};

export default HelpButton;
