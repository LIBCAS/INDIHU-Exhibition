import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";

// - -

type BackwardButtonProps = {
  navigateBack: () => void;
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
  getTutorialEnhanceClassnameByStepkeys: (stepKeys: string[]) => string;
};

const BackwardButton = ({
  navigateBack,
  getTutorialEclipseClassnameByStepkeys,
  getTutorialEnhanceClassnameByStepkeys,
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
          getTutorialEclipseClassnameByStepkeys(["navigation"]),
          getTutorialEnhanceClassnameByStepkeys(["navigation"])
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
