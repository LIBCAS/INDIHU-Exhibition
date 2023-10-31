import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { BasicTooltip } from "components/tooltip/tooltip";

import cx from "classnames";

// - -

type EditorButtonProps = {
  openEditorScreenUrl: () => void;
  isEditorAccess: boolean;
  isAnyTutorialOpened: boolean;
};

const EditorButton = ({
  openEditorScreenUrl,
  isEditorAccess,
  isAnyTutorialOpened,
}: EditorButtonProps) => {
  if (!isEditorAccess) {
    return null;
  }

  return (
    <>
      <div
        className={cx(
          "pointer-events-auto",
          isAnyTutorialOpened && "bg-black opacity-40"
        )}
        data-tooltip-id="overlay-editor-button-tooltip"
      >
        <Button color="expoTheme" onClick={openEditorScreenUrl}>
          <Icon name="edit" />
        </Button>
      </div>

      <BasicTooltip
        id="overlay-editor-button-tooltip"
        content="Upravit obrazovku"
      />
    </>
  );
};

export default EditorButton;
