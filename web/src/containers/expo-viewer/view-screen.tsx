import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useRouteMatch } from "react-router-dom";

// Custom Hooks
import { useFilePreloader } from "context/file-preloader/file-preloader-provider";
import { useExpoNavigation } from "hooks/view-hooks/expo-navigation-hook";

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

  const { params } = useRouteMatch<{ section: string; screen: string }>();
  const { screen, section } = params;

  const { screenPreloadedFiles, chapterMusicCache, isMusicLoading } =
    useFilePreloader();

  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(true);

  // audioSrc is either a string as 'blob:http://localhost:3000/adjasdkasjsdkas' or undefined
  // audioSrc is always screenPreloadedFiles.audio and not screenPreloadedFiles.music --> audio of the current screen!
  // audioSrc is undefined if the current screen does not its own audio set from editor settings
  // audioSrc is also in the start screen the audio subor of the whole expo
  // if audiosrc is undefined, <audio> element referring will not be rendered
  // If rendered -- <audio> will always have source of the current screen audio!!!
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioSrc = useMemo(
    () => screenPreloadedFiles?.audio,
    [screenPreloadedFiles]
  );

  const [musicSrc, setMusicSrc] = useState<string | null>(null);
  const musicRef = useRef<HTMLAudioElement>(null);

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

  /* Effect responsible for handling new setting new musicSrc, e.g when new section with our without music */
  useEffect(() => {
    if (section === "start" || section === "finish") {
      setMusicSrc(null);
      return;
    }
    const parsedSection = parseInt(section);
    if (isNaN(parsedSection)) {
      setMusicSrc(null);
      return;
    }

    if (!(parsedSection in chapterMusicCache)) {
      setMusicSrc(null);
      return;
    }

    const musicBlobSrc = chapterMusicCache[parsedSection];
    setMusicSrc(musicBlobSrc ?? null);
  }, [section, chapterMusicCache]);

  /* Effect reacting on previous effect when musicSrc has changed, handles automatic playing of new musicSrc  */
  useEffect(() => {
    if (!musicRef.current) {
      return;
    }

    const musicEl = musicRef.current;
    musicEl.loop = true;
    musicEl.volume = expoVolumes.musicVolume.actualVolume / 100;
    if (shouldIncrement) {
      musicEl.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicSrc]);

  /* Effect which pauses the playing chapter music if current screen does not support music playing */
  useEffect(() => {
    if (isMusicDisabled && musicRef.current) {
      musicRef.current.pause();
    }
  }, [isMusicDisabled]);

  /* Effect which handles automatic playing of current screen audio + when going to new screen.. pause and rewind old audio */
  useEffect(() => {
    if (!viewScreen || !audioRef.current) {
      return;
    }
    // E.g not to play the audio verze vystavy on the start screen!
    const isAudioDisabled =
      !audioEnabled[mapScreenTypeValuesToKeys[viewScreen.type]];

    if (isAudioDisabled) {
      return;
    }

    const audio = audioRef.current;
    if (shouldIncrement) {
      audio.volume = expoVolumes.speechVolume.actualVolume / 100;
      audio.play().catch((_error) => noop);
    }

    return () => {
      audio.currentTime = 0;
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewScreen, audioSrc]);

  /* Effect which handles muting of the music and audio when e.g mute button is pressed */
  useEffect(() => {
    if (musicRef.current) {
      const music = musicRef.current;
      music.volume = expoVolumes.musicVolume.actualVolume / 100;
    }
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = expoVolumes.speechVolume.actualVolume / 100;
    }
  }, [expoVolumes]);

  /* Effect which handles pausing / start playing of the music and audio when e.g pause button is pressed */
  useEffect(() => {
    if (musicRef.current) {
      const music = musicRef.current;
      if (shouldIncrement && !isMusicDisabled) {
        music.play();
      }
      if (!shouldIncrement && !isMusicDisabled) {
        music.pause();
      }
    }

    if (audioRef.current) {
      const audio = audioRef.current;
      if (shouldIncrement) {
        audio.play();
      } else {
        audio.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldIncrement]);

  // - -

  return (
    <ScreenAutoNavigator>
      {/* If rendered -- <audio> will always have source of the current screen audio!!! */}
      {musicSrc && <audio src={musicSrc} ref={musicRef} />}
      {audioSrc && <audio src={audioSrc} ref={audioRef} />}
      <Viewers
        isScreenLoading={isScreenLoading}
        screenPreloadedFiles={screenPreloadedFiles}
        isMusicLoading={isMusicLoading}
        chapterMusicRef={musicRef}
        audioRef={audioRef}
      />
    </ScreenAutoNavigator>
  );
};

// - - - -

const screenTransitionStateSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress.totalTime,
  ({ expo }: AppState) => expo.viewProgress.timeElapsed,
  ({ expo }: AppState) => expo.viewProgress.shouldRedirect,
  (totalTime, timeElapsed, shouldRedirect) => ({
    totalTime,
    timeElapsed,
    shouldRedirect,
  })
);

/* All screens other than START, FINISH and Game Screens are shouldRedirect = true */
/* This component, if the time of the screen is passed && shouldRedirect => auto switch to the next screen! */
const ScreenAutoNavigator = ({ children }: { children: ReactNode }) => {
  const { totalTime, timeElapsed, shouldRedirect } = useSelector(
    screenTransitionStateSelector
  );
  const { navigateForward } = useExpoNavigation();

  const timeRanOut = useMemo(
    () => timeElapsed >= totalTime,
    [timeElapsed, totalTime]
  );

  useEffect(() => {
    if (shouldRedirect && timeRanOut) {
      navigateForward();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRanOut, shouldRedirect]);

  return <>{children}</>;
};
