import { useTranslation } from "react-i18next";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { BasicTooltip } from "components/tooltip/tooltip";

import cx from "classnames";

// - -

type EditorButtonProps = {
  openEditorScreenUrl: () => void;
  isEditorAccess: boolean;
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const EditorButton = ({
  openEditorScreenUrl,
  isEditorAccess,
  getTutorialEclipseClassnameByStepkeys,
}: EditorButtonProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "overlay" });

  if (!isEditorAccess) {
    return null;
  }

  return (
    <>
      <div
        className={cx(
          "pointer-events-auto",
          getTutorialEclipseClassnameByStepkeys([""])
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
