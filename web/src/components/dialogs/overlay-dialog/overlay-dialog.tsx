import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { AppState } from "store/store";

import DialogWrap from "../dialog-wrap-noredux-typed";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { useTranslation } from "react-i18next";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (shouldIncrement) => ({ shouldIncrement })
);

// - -

interface OverlayDialogProps {
  closeThisDialog: () => void;
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
}

const OverlayDialog = ({
  closeThisDialog,
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
}: OverlayDialogProps) => {
  const { shouldIncrement } = useSelector(stateSelector);
  const { t } = useTranslation("view-screen", { keyPrefix: "overlayDialog" });

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">{t("title")}</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <div className="flex flex-col gap-4">
        {isEditorAccess && (
          <Button
            color="expoTheme"
            iconBefore={
              <Icon color="expoThemeMode" useMaterialUiIcon name="edit" />
            }
            onClick={openEditorScreenUrl}
          >
            {t("editCurrentScreen")}
          </Button>
        )}

        <Button
          color="expoTheme"
          iconBefore={
            <Icon color="expoThemeMode" useMaterialUiIcon name="settings" />
          }
          onClick={openSettingsDialog}
        >
          {t("openSettings")}
        </Button>

        {hasGlassMagnifier && (
          <Button
            color="expoTheme"
            iconBefore={
              <Icon color="expoThemeMode" useMaterialUiIcon name="zoom_in" />
            }
            onClick={openGlassMagnifierDialog}
          >
            {t("openGlassMagnifierSettings")}
          </Button>
        )}

        {hasAudio && (
          <Button
            color="expoTheme"
            iconBefore={
              <Icon
                color="expoThemeMode"
                useMaterialUiIcon
                name={isAudioMuted ? "volume_off" : "volume_up"}
              />
            }
            onClick={openAudioDialog}
          >
            {t("openAudioVolumeSettings")}
          </Button>
        )}

        <Button
          color="expoTheme"
          iconBefore={
            <Icon color="expoThemeMode" useMaterialUiIcon name="layers" />
          }
          onClick={openChaptersDialog}
        >
          {t("openChaptersOverview")}
        </Button>

        <div className="mt-6 px-12 flex justify-between">
          <Button color="expoTheme" onClick={navigateBack}>
            <Icon
              color="expoThemeMode"
              name="chevron_left"
              style={{ fontSize: "32px" }}
            />
          </Button>

          <Button
            color="expoTheme"
            iconBefore={
              <Icon
                color="expoThemeMode"
                name={shouldIncrement ? "pause" : "play_arrow"}
                style={{ fontSize: "32px" }}
              />
            }
            onClick={shouldIncrement ? pause : play}
          >
            {shouldIncrement ? t("pause") : t("play")}
          </Button>

          <Button color="expoTheme" onClick={navigateForward}>
            <Icon
              color="expoThemeMode"
              name="chevron_right"
              style={{ fontSize: "32px" }}
            />
          </Button>
        </div>
      </div>
    </DialogWrap>
  );
};

export default OverlayDialog;
