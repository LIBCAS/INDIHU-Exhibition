import { useState } from "react";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import DialogPortal from "context/dialog-ref-provider/DialogPortal";
import OverlayDialog from "components/dialogs/overlay-dialog/overlay-dialog";

// - -

type ExpandActionsButtonProps = {
  openEditorScreenUrl: () => void;
  isEditorAccess: boolean;
  openGlassMagnifierDialog: () => void;
  hasGlassMagnifier: boolean;
  openSettingsDialog: () => void;
  openAudioDialog: () => void;
  hasAudio: boolean;
  isAudioMuted: boolean;
  openChaptersDialog: () => void;
  play: () => void;
  pause: () => void;
  navigateBack: () => void;
  navigateForward: () => void;
};

const ExpandActionsButton = ({
  openEditorScreenUrl,
  isEditorAccess,
  openGlassMagnifierDialog,
  hasGlassMagnifier,
  openSettingsDialog,
  openAudioDialog,
  hasAudio,
  isAudioMuted,
  openChaptersDialog,
  play,
  pause,
  navigateBack,
  navigateForward,
}: ExpandActionsButtonProps) => {
  const [isOverlayDialogOpen, setIsOverlayDialogOpen] = useState(false); // to persist global state (redux or react api)

  const openOverlayDialog = () => setIsOverlayDialogOpen(true);
  const closeOverlayDialog = () => setIsOverlayDialogOpen(false);

  return (
    <>
      <div className="pointer-events-auto">
        <Button color="expoTheme" onClick={openOverlayDialog}>
          <Icon name="more_vert" />
        </Button>
      </div>

      {isOverlayDialogOpen && (
        <DialogPortal
          component={
            <OverlayDialog
              closeThisDialog={closeOverlayDialog}
              openEditorScreenUrl={openEditorScreenUrl}
              isEditorAccess={isEditorAccess}
              openGlassMagnifierDialog={openGlassMagnifierDialog}
              hasGlassMagnifier={hasGlassMagnifier}
              openSettingsDialog={openSettingsDialog}
              openAudioDialog={openAudioDialog}
              hasAudio={hasAudio}
              isAudioMuted={isAudioMuted}
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
