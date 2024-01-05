import { useMemo, useCallback, MutableRefObject } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import DialogPortal from "context/dialog-ref-provider/DialogPortal";
import { AudioDialog } from "components/dialogs/audio-dialog/audio-dialog";
import { GlassMagnifierDialog } from "components/dialogs/glass-magnifier-dialog/glass-magnifier-dialog";
import { SettingsDialog } from "components/dialogs/settings-dialog/settings-dialog";
import { ChaptersDialog } from "components/dialogs/chapters-dialog/chapters-dialog";

import useElementSize from "hooks/element-size-hook";
import { useSectionScreenParams } from "hooks/view-hooks/section-screen-hook";
import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";

// Components
import EditorButton from "./EditorButton";
import SettingsButton from "./SettingsButton";
import GlassMagnifierButton from "./GlassMagnifierButton/GlassMagnifierButton";
import PlayButton from "./PlayButton";
import AudioButton from "./AudioButton";
import ChaptersButtonContainer from "./ChaptersButtonContainer";

import NextButton from "./NextButton";

import InfoButton from "./InfoButton";
import ExpandActionsButton from "./ExpandActionsButton";

// Models
import { AppState } from "store/store";
import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

// Utils and actions
import {
  screenUrl,
  mapScreenTypeValuesToKeys,
  glassMagnifierEnabled,
  screenType,
} from "enums/screen-type";
import { openInNewTab, haveAccessToExpo } from "utils";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";

import useUser from "hooks/use-user";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.expoVolumes,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewExpo, viewScreen, expoVolumes, shouldIncrement) => ({
    viewExpo,
    viewScreen,
    expoVolumes,
    shouldIncrement,
  })
);

// - -

type ActionsPanelProps = {
  actionsPanelRef: MutableRefObject<HTMLDivElement | null>;
  isScreenAudioPresent: boolean;
  isChapterMusicPresent: boolean;
  openDrawer: () => void;
  play: () => void;
  pause: () => void;
  navigateBack: () => void;
  navigateForward: () => void;
  bind: (stepKey: string) => { ref: RefCallback };
  step: TutorialStep | null;
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const ActionsPanel = ({
  actionsPanelRef,
  isScreenAudioPresent,
  isChapterMusicPresent,
  openDrawer,
  play,
  pause,
  navigateBack,
  navigateForward,
  bind,
  step,
  getTutorialEclipseClassnameByStepkeys,
}: ActionsPanelProps) => {
  const { viewExpo, viewScreen, expoVolumes, shouldIncrement } =
    useSelector(stateSelector);

  const { userName, role } = useUser() ?? {};

  const sectionScreen = useSectionScreenParams();
  const { section, screen } = sectionScreen;
  const [actionsBoxRef, actionsBoxSize] = useElementSize();

  const isSm = useMediaQuery(breakpoints.down("sm"));

  const {
    openNewTopDialog,
    closeTopDialog,
    closeAllDialogs,
    isSettingsDialogOpen,
    isGlassMagnifierDialogOpen,
    isAudioDialogOpen,
    isChaptersDialogOpen,
  } = useDialogRef();

  // - - - - - - - - - - - - - - - - - - - -
  // - - OPEN EDITOR SCREEN HANDLER --
  const openEditorScreenUrl = () => {
    const expoId = viewExpo?.id;
    const viewScreenType = viewScreen?.type;

    if (section === undefined || screen === undefined) {
      return;
    }
    if (!expoId || !viewScreenType) {
      return;
    }

    const screenType = screenUrl[mapScreenTypeValuesToKeys[viewScreenType]];
    const url = `${window.origin}/expo/${expoId}/screen/${screenType}/${section}-${screen}/description`;
    openInNewTab(url);
  };

  const expoAuthor = viewExpo?.author?.username;
  const expoCollaborators = viewExpo?.collaborators;

  const isEditorAccess = haveAccessToExpo(
    role ?? [],
    userName ?? null,
    expoAuthor,
    expoCollaborators
  );

  // - - SETTINGS DIALOGS - -
  const openSettingsDialog = useCallback(
    () => openNewTopDialog(DialogRefType.SettingsDialog),
    [openNewTopDialog]
  );

  // - - GLASS MAGNIFIER DIALOG - -
  const hasGlassMagnifier =
    !!viewScreen &&
    glassMagnifierEnabled[mapScreenTypeValuesToKeys[viewScreen.type]];

  const openGlassMagnifierDialog = useCallback(
    () => openNewTopDialog(DialogRefType.GlassMagnifierDialog),
    [openNewTopDialog]
  );

  // - - AUDIO DIALOG - -
  const hasAudio =
    !!(viewScreen && "audio" in viewScreen && viewScreen.audio) ||
    isChapterMusicPresent ||
    !!(viewScreen && "video" in viewScreen && viewScreen.video);

  const isAudioMuted = useMemo(
    () =>
      expoVolumes.speechVolume.actualVolume === 0 &&
      expoVolumes.musicVolume.actualVolume === 0,
    [expoVolumes]
  );

  const openAudioDialog = useCallback(
    () => openNewTopDialog(DialogRefType.AudioDialog),
    [openNewTopDialog]
  );

  // - - CHAPTERS DIALOG - -
  const openChaptersDialog = useCallback(
    () => openNewTopDialog(DialogRefType.ChaptersDialog),
    [openNewTopDialog]
  );

  return (
    <div
      className={cx(
        classes.actions,
        "h-full p-3 flex flex-row-reverse justify-start items-end gap-4 "
      )}
      ref={(divEl) => {
        actionsBoxRef(divEl);
        actionsPanelRef.current = divEl;
      }}
    >
      {isSm && (
        <div className="flex gap-2">
          <InfoButton openDrawer={openDrawer} />
          <ExpandActionsButton
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
        </div>
      )}

      {!isSm && (
        <div className="flex flex-col gap-3">
          {viewScreen?.type === screenType.SIGNPOST && (
            <NextButton nextScreenId={viewScreen.nextScreenReference} />
          )}

          <div className="flex items-end gap-2">
            <EditorButton
              openEditorScreenUrl={openEditorScreenUrl}
              isEditorAccess={isEditorAccess}
              getTutorialEclipseClassnameByStepkeys={
                getTutorialEclipseClassnameByStepkeys
              }
            />
            <SettingsButton
              getTutorialEclipseClassnameByStepkeys={
                getTutorialEclipseClassnameByStepkeys
              }
            />
            <GlassMagnifierButton
              hasGlassMagnifier={hasGlassMagnifier}
              getTutorialEclipseClassnameByStepkeys={
                getTutorialEclipseClassnameByStepkeys
              }
            />
            <PlayButton
              shouldIncrement={shouldIncrement}
              play={play}
              pause={pause}
              bind={bind}
              getTutorialEclipseClassnameByStepkeys={
                getTutorialEclipseClassnameByStepkeys
              }
            />
            <AudioButton
              // conditional rendered
              hasAudio={hasAudio}
              isAudioMuted={isAudioMuted}
              bind={bind}
              getTutorialEclipseClassnameByStepkeys={
                getTutorialEclipseClassnameByStepkeys
              }
              step={step}
            />
            <ChaptersButtonContainer
              bind={bind}
              actionsBoxSize={actionsBoxSize}
              getTutorialEclipseClassnameByStepkeys={
                getTutorialEclipseClassnameByStepkeys
              }
            />
          </div>
        </div>
      )}

      {isSettingsDialogOpen && (
        <DialogPortal
          component={<SettingsDialog closeThisDialog={closeTopDialog} />}
        />
      )}

      {isGlassMagnifierDialogOpen && (
        <DialogPortal
          component={<GlassMagnifierDialog closeThisDialog={closeTopDialog} />}
        />
      )}

      {isAudioDialogOpen && (
        <DialogPortal
          component={
            <AudioDialog
              closeThisDialog={closeTopDialog}
              hasSpeechVolume={isScreenAudioPresent}
              hasMusicVolume={isChapterMusicPresent}
              isVideoPresent={
                (viewScreen && "video" in viewScreen && !!viewScreen.video) ??
                false
              }
            />
          }
        />
      )}

      {isChaptersDialogOpen && (
        <DialogPortal
          component={
            <ChaptersDialog
              closeThisDialog={closeTopDialog}
              screens={viewExpo?.structure?.screens}
              viewExpoUrl={viewExpo?.url}
              hightlight={sectionScreen}
              onClick={closeAllDialogs}
            />
          }
        />
      )}
    </div>
  );
};

export default ActionsPanel;
