import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import DialogPortal from "context/dialog-ref-provider/DialogPortal";
import OverlayDialog from "components/dialogs/overlay-dialog/overlay-dialog";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";
import { RefCallback } from "context/tutorial-provider/use-tutorial";

import cx from "classnames";

// - -

type ExpandActionsButtonProps = {
  openEditorScreenUrl: () => void;
  isEditorAccess: boolean;
  openSettingsDialog: () => void;
  hasGlassMagnifier: boolean;
  openGlassMagnifierDialog: () => void;
  hasAudio: boolean;
  isAudioMuted: boolean;
  openAudioDialog: () => void;
  openChaptersDialog: () => void;
  play: () => void;
  pause: () => void;
  navigateBack: () => void;
  navigateForward: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const ExpandActionsButton = ({
  openEditorScreenUrl,
  isEditorAccess,
  openSettingsDialog,
  hasGlassMagnifier,
  openGlassMagnifierDialog,
  hasAudio,
  isAudioMuted,
  openAudioDialog,
  openChaptersDialog,
  play,
  pause,
  navigateBack,
  navigateForward,
  bind,
  getTutorialEclipseClassnameByStepkeys,
}: ExpandActionsButtonProps) => {
  const { openNewTopDialog, closeTopDialog, isOverlayDialogOpen } =
    useDialogRef();

  return (
    <>
      <div
        {...bind("overlay-button")}
        className={cx(
          "pointer-events-auto",
          getTutorialEclipseClassnameByStepkeys(["overlay-button"])
        )}
      >
        <Button
          color="expoTheme"
          onClick={() => openNewTopDialog(DialogRefType.OverlayDialog)}
        >
          <Icon name="more_vert" />
        </Button>
      </div>

      {isOverlayDialogOpen && (
        <DialogPortal
          component={
            <OverlayDialog
              closeThisDialog={closeTopDialog}
              openEditorScreenUrl={openEditorScreenUrl}
              isEditorAccess={isEditorAccess}
              openSettingsDialog={openSettingsDialog}
              hasGlassMagnifier={hasGlassMagnifier}
              openGlassMagnifierDialog={openGlassMagnifierDialog}
              hasAudio={hasAudio}
              isAudioMuted={isAudioMuted}
              openAudioDialog={openAudioDialog}
              openChaptersDialog={openChaptersDialog}
              play={play}
              pause={pause}
              navigateBack={navigateBack}
              navigateForward={navigateForward}
            />
          }
        />
      )}
    </>
  );
};

export default ExpandActionsButton;
