import { RefObject } from "react";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";

// - -

type ForwardButtonProps = {
  navigateForward: () => void;
  forwardButtonRef: RefObject<HTMLDivElement>;
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const ForwardButton = ({
  navigateForward,
  forwardButtonRef,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: ForwardButtonProps) => {
  return (
    <div
      className={cx(
        classes.rightNav, // rightNav in the grid
        "flex h-full items-center justify-end"
      )}
    >
      <div
        {...bind("navigation")}
        className={cx(
          "pointer-events-auto",
          isAnyTutorialOpened &&
            (!isTutorialOpen || step?.stepKey !== "navigation") &&
            "bg-black opacity-40"
        )}
      >
        <div ref={forwardButtonRef}>
          <Button color="expoTheme" onClick={navigateForward}>
            <Icon name="chevron_right" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForwardButton;
