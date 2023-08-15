import { ChaptersButton } from "./chapters-button";

import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";
import { Size } from "hooks/element-size-hook";

import cx from "classnames";

// - -

type ChaptersButtonContainerProps = {
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
  actionsBoxSize: Size;
};

const ChaptersButtonContainer = ({
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
  actionsBoxSize,
}: ChaptersButtonContainerProps) => {
  return (
    <div
      {...bind("chapters")}
      className={cx(
        "pointer-events-auto",
        isAnyTutorialOpened &&
          (!isTutorialOpen || step?.stepKey !== "chapters") &&
          "bg-black opacity-40"
      )}
    >
      <ChaptersButton maxHeight={actionsBoxSize.height - 35} />
    </div>
  );
};

export default ChaptersButtonContainer;
