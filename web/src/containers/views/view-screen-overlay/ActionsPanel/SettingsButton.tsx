import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { BasicTooltip } from "components/tooltip/tooltip";

import cx from "classnames";
import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";

// - -

type SettingsButtonProps = {
  isAnyTutorialOpened: boolean;
};

const SettingsButton = ({ isAnyTutorialOpened }: SettingsButtonProps) => {
  const { openNewTopDialog } = useDialogRef();

  return (
    <>
      <div
        className={cx(
          "pointer-events-auto",
          isAnyTutorialOpened && "bg-black opacity-40"
        )}
        data-tooltip-id="overlay-settings-button-tooltip"
      >
        <Button
          color="expoTheme"
          onClick={() => openNewTopDialog(DialogRefType.SettingsDialog)}
        >
          <Icon name="settings" />
        </Button>
      </div>

      <BasicTooltip
        id="overlay-settings-button-tooltip"
        content="Otevřít nastavení"
      />
    </>
  );
};

export default SettingsButton;
