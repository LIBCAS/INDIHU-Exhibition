import { useTranslation } from "react-i18next";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { RefCallback } from "context/tutorial-provider/use-tutorial";

import cx from "classnames";

// - -

type EditorButtonProps = {
  bind: (stepKey: string) => { ref: RefCallback };
  openEditorScreenUrl: () => void;
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const EditorButton = ({
  bind,
  openEditorScreenUrl,
  getTutorialEclipseClassnameByStepkeys,
}: EditorButtonProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "overlay" });

  return (
    <div
      {...bind("editor")}
      className={cx(
        "pointer-events-auto",
        getTutorialEclipseClassnameByStepkeys(["editor"])
      )}
    >
      <Button
        color="expoTheme"
        onClick={openEditorScreenUrl}
        tooltip={{
          id: "overlay-editor-button-tooltip",
          content: t("editorButtonTooltip"),
        }}
      >
        <Icon name="edit" />
      </Button>
    </div>
  );
};

export default EditorButton;
