import { ChaptersButton } from "./chapters-button";

import { RefCallback } from "context/tutorial-provider/use-tutorial";

import { Size } from "models";

import cx from "classnames";

// - -

type ChaptersButtonContainerProps = {
  bind: (stepKey: string) => { ref: RefCallback };
  actionsBoxSize: Size;
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const ChaptersButtonContainer = ({
  bind,
  actionsBoxSize,
  getTutorialEclipseClassnameByStepkeys,
}: ChaptersButtonContainerProps) => {
  return (
    <div
      {...bind("chapters")}
      className={cx(
        "pointer-events-auto",
        getTutorialEclipseClassnameByStepkeys(["chapters"])
      )}
    >
      <ChaptersButton maxHeight={actionsBoxSize.height - 35} />
    </div>
  );
};

export default ChaptersButtonContainer;
