import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { RefCallback } from "context/tutorial-provider/use-tutorial";

// Utils
import cx from "classnames";

// - -

type InfoButtonProps = {
  openDrawer: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const InfoButton = ({
  openDrawer,
  bind,
  getTutorialEclipseClassnameByStepkeys,
}: InfoButtonProps) => {
  return (
    <div
      {...bind("screen-info")}
      className={cx(
        "pointer-events-auto",
        getTutorialEclipseClassnameByStepkeys(["screen-info"])
      )}
    >
      <Button color="expoTheme" onClick={openDrawer}>
        <Icon name="info" />
      </Button>
    </div>
  );
};

export default InfoButton;
