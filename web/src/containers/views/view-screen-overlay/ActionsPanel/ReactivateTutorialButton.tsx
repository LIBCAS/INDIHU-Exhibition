import { useTranslation } from "react-i18next";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import cx from "classnames";
import { RefCallback } from "context/tutorial-provider/use-tutorial";

// - - -

type ReactivateTutorialButtonProps = {
  reactivateTutorial: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const ReactivateTutorialButton = ({
  reactivateTutorial,
  bind,
  getTutorialEclipseClassnameByStepkeys,
}: ReactivateTutorialButtonProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "overlay" });

  return (
    <div
      {...bind("reactivate-tutorial")}
      className={cx(
        "pointer-events-auto",
        getTutorialEclipseClassnameByStepkeys(["reactivate-tutorial"])
      )}
    >
      <Button
        color="expoTheme"
        onClick={reactivateTutorial}
        tooltip={{
          id: "overlay-reactivate-tutorial-button-tooltip",
          content: t("reactivateTooltipButtonTooltip"),
        }}
      >
        <Icon name="quiz" useMaterialUiIcon iconStyle={{ fontSize: "24px" }} />
      </Button>
    </div>
  );
};

export default ReactivateTutorialButton;
