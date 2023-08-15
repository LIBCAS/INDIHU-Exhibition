import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";

// - -

type BackwardButtonProps = {
  navigateBack: () => void;
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const BackwardButton = ({
  navigateBack,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: BackwardButtonProps) => {
  return (
    <div
      className={cx(
        classes.leftNav, // leftNav in the grid
        "flex h-full items-center justify-start"
      )}
    >
      <div
        className={cx(
          "pointer-events-auto",
          isTutorialOpen &&
            step?.stepKey === "navigation" &&
            "border-solid border-4 border-primary",
          isAnyTutorialOpened &&
            (!isTutorialOpen || step?.stepKey !== "navigation") &&
            "bg-black opacity-40"
        )}
      >
        <Button color="expoTheme" onClick={navigateBack}>
          <Icon name="chevron_left" />
        </Button>
      </div>
    </div>
  );
};

export default BackwardButton;
