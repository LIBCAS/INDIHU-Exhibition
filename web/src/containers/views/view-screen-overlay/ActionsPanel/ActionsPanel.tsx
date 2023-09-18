import { useMemo, useCallback, MutableRefObject } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import useElementSize from "hooks/element-size-hook";
import { useSectionScreenParams } from "hooks/view-hooks/section-screen-hook";
// import { breakpoints } from "hooks/media-query-hook/breakpoints";
// import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";

import EditorButton from "./EditorButton";
import SettingsButton from "./SettingsButton";
import GlassMagnifierButton from "./GlassMagnifierButton/GlassMagnifierButton";
import PlayButton from "./PlayButton";
import AudioButton from "./AudioButton";
import ChaptersButtonContainer from "./ChaptersButtonContainer";

// import InfoButton from "./InfoButton";
// import ExpandActionsButton from "./ExpandActionsButton";

import { AppState, AppDispatch } from "store/store";
import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import { DialogType } from "components/dialogs/dialog-types";
import { setDialog } from "actions/dialog-actions";

import {
  screenUrl,
  mapScreenTypeValuesToKeys,
  glassMagnifierEnabled,
} from "enums/screen-type";
import { openInNewTab, haveAccessToExpo } from "utils";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.expoVolumes,
  ({ user }: AppState) => user.userName,
  ({ user }: AppState) => user.role,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewExpo, viewScreen, expoVolumes, userName, role, shouldIncrement) => ({
    viewExpo,
    viewScreen,
    expoVolumes,
    userName,
    role,
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
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const ActionsPanel = ({
  actionsPanelRef,
  isScreenAudioPresent,
  isChapterMusicPresent,
  // openDrawer,
  play,
  pause,
  // navigateBack,
  // navigateForward,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: ActionsPanelProps) => {
  const { viewExpo, viewScreen, expoVolumes, userName, role, shouldIncrement } =
    useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const sectionScreen = useSectionScreenParams();
  const { section, screen } = sectionScreen;
  const [actionsBoxRef, actionsBoxSize] = useElementSize();
  // const isSm = useMediaQuery(breakpoints.down("sm"));

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
    role,
    userName,
    expoAuthor,
    expoCollaborators
  );

  // - - GLASS MAGNIFIER TOOLTIP (desktop) / DIALOG (mobile) - -
  // const openGlassMagnifierDialog = useCallback(() => {
  //   dispatch(setDialog(DialogType.GlassMagnifierDialog, {}));
  // }, [dispatch]);

  const hasGlassMagnifier =
    !!viewScreen &&
    glassMagnifierEnabled[mapScreenTypeValuesToKeys[viewScreen.type]];

  // - - SETTINGS DIALOG - -
  const openSettingsDialog = useCallback(() => {
    dispatch(setDialog(DialogType.SettingsDialog, {}));
  }, [dispatch]);

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

  const openAudioDialog = useCallback(() => {
    dispatch(
      setDialog(DialogType.AudioDialog, {
        hasSpeechVolume: isScreenAudioPresent,
        hasMusicVolume: isChapterMusicPresent,
        isVideoPresent:
          (viewScreen && "video" in viewScreen && !!viewScreen.video) ?? false,
      })
    );
  }, [dispatch, isChapterMusicPresent, isScreenAudioPresent, viewScreen]);

  // - - CHAPTERS DIALOG - -
  // const openChaptersDialog = useCallback(
  //   () =>
  //     dispatch(
  //       setDialog(DialogType.ChaptersDialog, {
  //         screens: viewExpo?.structure?.screens,
  //         viewExpoUrl: viewExpo?.url,
  //         hightlight: sectionScreen,
  //       })
  //     ),
  //   [dispatch, sectionScreen, viewExpo?.structure?.screens, viewExpo?.url]
  // );

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
      {/* {isSm && (
        <div className="flex gap-2">
          <InfoButton openDrawer={openDrawer} />
          <ExpandActionsButton
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
        </div>
      )} */}

      <div className="flex items-end gap-2">
        <EditorButton
          openEditorScreenUrl={openEditorScreenUrl}
          isEditorAccess={isEditorAccess}
          isAnyTutorialOpened={isAnyTutorialOpened}
        />
        <SettingsButton
          openSettingsDialog={openSettingsDialog}
          isAnyTutorialOpened={isAnyTutorialOpened}
        />
        <GlassMagnifierButton hasGlassMagnifier={hasGlassMagnifier} />
        <PlayButton
          shouldIncrement={shouldIncrement}
          play={play}
          pause={pause}
          bind={bind}
          isTutorialOpen={isTutorialOpen}
          isAnyTutorialOpened={isAnyTutorialOpened}
          step={step}
        />
        <AudioButton
          // conditional rendered
          hasAudio={hasAudio}
          isAudioMuted={isAudioMuted}
          openAudioDialog={openAudioDialog}
          bind={bind}
          isTutorialOpen={isTutorialOpen}
          isAnyTutorialOpened={isAnyTutorialOpened}
          step={step}
        />
        <ChaptersButtonContainer
          bind={bind}
          isTutorialOpen={isTutorialOpen}
          isAnyTutorialOpened={isAnyTutorialOpened}
          step={step}
          actionsBoxSize={actionsBoxSize}
        />
      </div>
    </div>
  );
};

export default ActionsPanel;
