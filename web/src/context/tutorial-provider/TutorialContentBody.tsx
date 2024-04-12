import { useTranslation } from "react-i18next";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { TutorialStep } from "./tutorial-provider";

// - -

type TutorialContentBodyProps = {
  currStepObj: TutorialStep;
  currStepIndex: number;
  numberOfSteps: number;
  skipTutorial: () => void;
  nextTutorialStep: () => void;
};

const TutorialContentBody = ({
  currStepObj,
  currStepIndex,
  numberOfSteps,
  skipTutorial,
  nextTutorialStep,
}: TutorialContentBodyProps) => {
  const { t } = useTranslation("tutorial");

  return (
    <div className="p-2">
      <div className="flex justify-between">
        <span className="text-2xl font-semibold inline-block mb-2">
          {currStepObj.label}
        </span>
        <span className="text-gray">
          {currStepIndex + 1} z {numberOfSteps}
        </span>
      </div>
      <p className="text-inherit">{currStepObj.text}</p>
      <div className="flex items-center justify-between gap-2">
        <Button
          color="expoTheme"
          iconBefore={<Icon color="primary" name="skip_next" />}
          onClick={skipTutorial}
        >
          {t("skip", { ns: "tutorial" })}
        </Button>
        <Button color="primary" onClick={nextTutorialStep}>
          {currStepIndex + 1 === numberOfSteps
            ? t("finish", { ns: "tutorial" })
            : t("next", { ns: "tutorial" })}
        </Button>
      </div>
    </div>
  );
};

export default TutorialContentBody;
