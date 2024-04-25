import { useTranslation } from "react-i18next";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { BasicTooltip } from "components/tooltip/tooltip";

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
    <>
      <div
        {...bind("editor")}
        className={cx(
          "pointer-events-auto",
          getTutorialEclipseClassnameByStepkeys(["editor"])
        )}
        data-tooltip-id="overlay-editor-button-tooltip"
      >
        <Button color="expoTheme" onClick={openEditorScreenUrl}>
          <Icon name="edit" />
        </Button>
      </div>

      <BasicTooltip
        id="overlay-editor-button-tooltip"
        content={t("editorButtonTooltip")}
      />
    </>
  );
};

export default EditorButton;
