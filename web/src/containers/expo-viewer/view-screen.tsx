import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useHistory } from "react-router-dom";

// Custom Hooks
import { useFilePreloader } from "context/file-preloader/file-preloader-provider";
import { useExpoNavigation } from "hooks/view-hooks/expo-navigation-hook";
import { useScreenDataByScreenId } from "hooks/view-hooks/useScreenDataByScreenId";

// Components
import { Viewers } from "../views";

// Actions and utils
import { setViewProgress } from "actions/expoActions/viewer-actions";
import { noop } from "lodash";

// Types and Enums
import { AppState } from "store/store";
import {
  audioEnabled,
  automaticRouting,
  mapScreenTypeValuesToKeys,
  musicEnabled,
} from "enums/screen-type";
import { useSectionScreenParams } from "hooks/view-hooks/section-screen-hook";

// - - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  ({ expo }: AppState) => expo.expoVolumes,
  (viewScreen, shouldIncrement, expoVolumes) => ({
    viewScreen,
    shouldIncrement,
    expoVolumes,
  })
);

interface NewViewScreenProps {
  name: string;
  handleViewScreen: ({ section, screen }: any) => Promise<any>;
  setViewScreenIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewViewScreen = ({
  handleViewScreen,
  setViewScreenIsLoaded,
}: NewViewScreenProps) => {
  const { viewScreen, shouldIncrement, expoVolumes } =
    useSelector(stateSelector);
  const dispatch = useDispatch();

  const { section, screen } = useSectionScreenParams();

  const {
    screenPreloadedFiles,
    isLoading: areScreenFilesLoading,
    chapterMusicCache,
    isMusicLoading,
  } = useFilePreloader();

  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(true);

  // audioSrc is either a string as 'blob:http://localhost:3000/adjasdkasjsdkas' or undefined
  // audioSrc is always screenPreloadedFiles.audio and not screenPreloadedFiles.music --> audio of the current screen!
  // audioSrc is undefined if the current screen does not its own audio set from editor settings
  // audioSrc is also in the start screen the audio subor of the whole expo
  // if audiosrc is undefined, <audio> element referring will not be rendered
  // If rendered -- <audio> will always have source of the current screen audio!!!
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const audioSrc = useMemo(
    () => screenPreloadedFiles?.audio,
    [screenPreloadedFiles]
  );

  const [musicRef, setMusicRef] = useState<HTMLAudioElement | null>(null);
  const [musicSrc, setMusicSrc] = useState<string | null>(null);

  const isMusicDisabled = useMemo(() => {
    if (!viewScreen) {
      return false;
    }
    const mutedScreenByAdmin =
      "muteChapterMusic" in viewScreen && viewScreen.muteChapterMusic;
    const mutedScreenAlways =
      !musicEnabled[mapScreenTypeValuesToKeys[viewScreen.type]];

    return mutedScreenByAdmin || mutedScreenAlways;
  }, [viewScreen]);

  // - -

  const handleMount = useCallback(async () => {
    setIsScreenLoading(true);
    await handleViewScreen({ section, screen });
    setViewScreenIsLoaded(true);
    setIsScreenLoading(false);
  }, [handleViewScreen, screen, section, setViewScreenIsLoaded]);

  /* 1.) Mount this NewViewScreen in ViewScreen.tsx */
  useEffect(() => {
    handleMount();
  }, [handleMount]);

  // 2.) According to the viewScreen.type ("INTRO", "START", ... ) set appropriate viewProgress.shouldRedirect
  // shouldRedirect is false only for START and FINISH + PHOTOGALLERY screens (GAME screen are true after upgrade)
  // This shouldRedirect is then used in the wrappering ScreenAutoNavigator component below, at the bottom of this file
  useEffect(() => {
    if (!viewScreen?.type) {
      return;
    }

    const shouldRedirect =
      !!automaticRouting[mapScreenTypeValuesToKeys[viewScreen.type]];

    dispatch(setViewProgress({ shouldRedirect }));
  }, [dispatch, viewScreen?.type]);

  // - - -

  /* Effect responsible for handling setting new musicSrc, e.g when new section with our without music */
  useEffect(() => {
    if (section === undefined || section === "start" || section === "finish") {
      setMusicSrc(null);
      return;
    }

    if (!(section in chapterMusicCache)) {
      setMusicSrc(null);
      return;
    }

    const musicBlobSrc = chapterMusicCache[section];
    setMusicSrc(musicBlobSrc ?? null);
  }, [section, chapterMusicCache]);

  /* Effect reacting on previous effect when musicSrc has changed, handles automatic playing of new musicSrc  */
  useEffect(() => {
    if (!musicRef) {
      return;
    }

    musicRef.loop = true;
    musicRef.volume = expoVolumes.musicVolume.actualVolume / 100;
    if (shouldIncrement) {
      musicRef.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicSrc, musicRef]);

  /* Effect which pauses the playing chapter music if current screen does not support music playing */
  useEffect(() => {
    if (musicRef && isMusicDisabled) {
      musicRef.pause();
      return;
    }
    if (musicRef && !isMusicDisabled) {
      musicRef.play();
    }
  }, [isMusicDisabled, musicRef]);

  /* Effect which handles automatic playing of current screen audio + when going to new screen.. pause and rewind old audio */
  useEffect(() => {
    if (!viewScreen || !audioRef) {
      return;
    }
    // E.g not to play the audio verze vystavy on the start screen!
    // TODO -- out as memo use
    const isAudioDisabled =
      !audioEnabled[mapScreenTypeValuesToKeys[viewScreen.type]];

    if (isAudioDisabled) {
      return;
    }

    if (shouldIncrement) {
      audioRef.volume = expoVolumes.speechVolume.actualVolume / 100;
      audioRef.play().catch((_error) => noop);
    }

    return () => {
      // TODO now should be not required!
      audioRef.currentTime = 0;
      audioRef.pause();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewScreen, audioSrc, audioRef]);

  /* Effect which handles muting of the music and audio when e.g mute button is pressed */
  useEffect(() => {
    if (musicRef) {
      musicRef.volume = expoVolumes.musicVolume.actualVolume / 100;
    }
    if (audioRef) {
      audioRef.volume = expoVolumes.speechVolume.actualVolume / 100;
    }
  }, [expoVolumes, audioRef, musicRef]);

  /* Effect which handles pausing / start playing of the music and audio when e.g pause button is pressed */
  useEffect(() => {
    if (musicRef) {
      if (shouldIncrement && !isMusicDisabled) {
        musicRef.play();
      }
      if (!shouldIncrement && !isMusicDisabled) {
        musicRef.pause();
      }
    }

    if (audioRef) {
      if (shouldIncrement) {
        audioRef.play().catch((_error) => noop);
      } else {
        audioRef.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldIncrement, audioRef, musicRef]);

  // - -

  return (
    <ScreenAutoNavigator>
      {/* If rendered -- <audio> will always have source of the current screen audio!!! */}
      {musicSrc && (
        <audio
          key={musicSrc}
          src={musicSrc}
          ref={(musicRef) => setMusicRef(musicRef)}
        />
      )}
      {audioSrc && (
        <audio
          key={audioSrc}
          src={audioSrc}
          ref={(audioRef) => setAudioRef(audioRef)}
        />
      )}
      <Viewers
        isScreenLoading={isScreenLoading}
        screenPreloadedFiles={screenPreloadedFiles}
        areScreenFilesLoading={areScreenFilesLoading}
        isMusicLoading={isMusicLoading}
        chapterMusicRef={musicRef}
        audioRef={audioRef}
      />
    </ScreenAutoNavigator>
  );
};

// - - - -

const navigatorSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({
    viewScreen,
    viewProgress,
  })
);

/* All screens other than START, FINISH and Game Screens are shouldRedirect = true */
/* This component, if the time of the screen is passed && shouldRedirect => auto switch to the next screen! */
const ScreenAutoNavigator = ({ children }: { children: ReactNode }) => {
  const { viewProgress, viewScreen } = useSelector(navigatorSelector);
  const { totalTime, timeElapsed, shouldRedirect } = viewProgress;

  const { navigateForward } = useExpoNavigation();

  const timeRanOut = useMemo(
    () => timeElapsed >= totalTime,
    [timeElapsed, totalTime]
  );

  // - -

  const history = useHistory();

  const signpostNavigate =
    viewScreen?.type === "SIGNPOST"
      ? viewScreen.nextScreenReference ?? null
      : null;

  const { screenReferenceUrl: signpostScreenReferenceUrl } =
    useScreenDataByScreenId(signpostNavigate) ?? {};

  // - -

  useEffect(() => {
    if (shouldRedirect && timeRanOut) {
      if (signpostScreenReferenceUrl) {
        history.push(signpostScreenReferenceUrl);
      } else {
        navigateForward();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRanOut, shouldRedirect, signpostScreenReferenceUrl]);

  return <>{children}</>;
};
