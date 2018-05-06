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
      <Button
        iconBefore={<Icon name="info" />}
        color="primary"
        onClick={openDrawer}
        style={{ width: "38px", height: "31px", border: "2px solid white" }}
      />
    </div>
  );
};

export default InfoButton;
