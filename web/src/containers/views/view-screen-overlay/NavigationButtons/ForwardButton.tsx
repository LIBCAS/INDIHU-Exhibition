import { RefObject } from "react";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { RefCallback } from "context/tutorial-provider/use-tutorial";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";

// - -

type ForwardButtonProps = {
  navigateForward: () => void;
  forwardButtonRef: RefObject<HTMLDivElement>;
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const ForwardButton = ({
  navigateForward,
  forwardButtonRef,
  bind,
  getTutorialEclipseClassnameByStepkeys,
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
          getTutorialEclipseClassnameByStepkeys(["navigation"])
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
