import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { RefCallback } from "context/tutorial-provider/use-tutorial";

import cx from "classnames";
import { useTranslation } from "react-i18next";

// - -

type PlayButtonProps = {
  shouldIncrement: boolean;
  play: () => void;
  pause: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const PlayButton = ({
  shouldIncrement,
  play,
  pause,
  bind,
  getTutorialEclipseClassnameByStepkeys,
}: PlayButtonProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "overlay" });

  return (
    <div
      {...bind("play")}
      className={cx(
        "pointer-events-auto",
        getTutorialEclipseClassnameByStepkeys(["play"])
      )}
    >
      <Button
        color="expoTheme"
        onClick={shouldIncrement ? pause : play}
        tooltip={{
          id: "overlay-play-button-tooltip",
          content: shouldIncrement
            ? t("stopButtonTooltip")
            : t("playButtonTooltip"),
        }}
      >
        <Icon name={shouldIncrement ? "pause" : "play_arrow"} />
      </Button>
    </div>
  );
};

export default PlayButton;
