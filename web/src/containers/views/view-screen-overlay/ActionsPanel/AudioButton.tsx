import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { useTranslation } from "react-i18next";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { BasicTooltip } from "components/tooltip/tooltip";

import { RefCallback } from "context/tutorial-provider/use-tutorial";

import cx from "classnames";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";

type AudioButtonProps = {
  isAudioMuted: boolean;
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const AudioButton = ({
  isAudioMuted,
  bind,
  getTutorialEclipseClassnameByStepkeys,
}: AudioButtonProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "overlay" });
  const { openNewTopDialog } = useDialogRef();

  return (
    <>
      <div
        {...bind("audio")}
        className={cx(
          "pointer-events-auto",
          getTutorialEclipseClassnameByStepkeys(["audio"])
        )}
        data-tooltip-id="overlay-audio-button-tooltip"
      >
        <Button
          color="expoTheme"
          onClick={() => openNewTopDialog(DialogRefType.AudioDialog)}
        >
          <Icon name={isAudioMuted ? "volume_off" : "volume_up"} />
        </Button>
      </div>

      <BasicTooltip
        id="overlay-audio-button-tooltip"
        content={t("audioButtonTooltip")}
      />
    </>
  );
};

export default AudioButton;
