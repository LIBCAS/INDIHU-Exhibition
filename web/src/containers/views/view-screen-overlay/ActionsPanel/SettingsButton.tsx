import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

import cx from "classnames";

// - -

type SettingsButtonProps = {
  isAnyTutorialOpened: boolean;
};

const SettingsButton = ({ isAnyTutorialOpened }: SettingsButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const openSettingsDialog = useCallback(() => {
    dispatch(setDialog(DialogType.SettingsDialog, {}));
  }, [dispatch]);

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
