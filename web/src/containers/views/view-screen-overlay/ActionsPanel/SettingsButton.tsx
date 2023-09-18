import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import cx from "classnames";

// - -

type SettingsButtonProps = {
  openSettingsDialog: () => void;
  isAnyTutorialOpened: boolean;
};

const SettingsButton = ({
  openSettingsDialog,
  isAnyTutorialOpened,
}: SettingsButtonProps) => {
  return (
    <div
      className={cx(
        "pointer-events-auto",
        isAnyTutorialOpened && "bg-black opacity-40"
      )}
    >
      <Button color="expoTheme" onClick={openSettingsDialog}>
        <Icon name="settings" />
      </Button>
    </div>
  );
};

export default SettingsButton;
