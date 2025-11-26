import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Custom Hooks
import { useSectionScreenParams } from "hooks/view-hooks/section-screen-hook";
import { useFilePreloader } from "context/file-preloader/file-preloader-provider";

// Components
import ScreenAutoNavigatorManager from "./expo-managers/ScreenAutoNavigatorManager";
import { Viewers } from "../views";

// Types and Enums
import { AppState, AppDispatch } from "store/store";

// Utils
import { store } from "index";
import {
  mapScreenTypeValuesToKeys,
  musicEnabled,
  audioEnabled,
} from "enums/screen-type";

// Redux (actions)
import { setViewProgress } from "actions/expoActions/viewer-actions";

// - - - - - -

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

// - - - - - -

interface NewViewScreenProps {
  name: string;
  handleViewScreen: ({ section, screen }: any) => Promise<any>;
  setViewScreenIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewViewScreen = ({
  handleViewScreen,
  setViewScreenIsLoaded,
}: NewViewScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { viewScreen, shouldIncrement, expoVolumes } =
    useSelector(stateSelector);

  const { section, screen } = useSectionScreenParams();

  const {
    screenPreloadedFiles,
    isLoading: areScreenFilesLoading,
    chapterMusicCache,
    isMusicLoading,
    soundtrackUrl,
    isSoundtrackLoading,
  } = useFilePreloader();

  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(true);

  // - - - Audio - - -

  /**
   * 1. Audio source is either a blob URL string (which can be directly used for src atribute) or undefined
   * 2. Audio source presents the audio only for the current single screen
   * 3. Audio source is undefined if the current screen does not have its own audio set from the screen editor
   * 4. Audio source (audio key) is also used in the start screen where it should represent audio for the whole expo
   * 5. If audio source is undefined, then <audio> element referring it should not be rendered
   */
  const audioSrc = useMemo<string | undefined>(() => {
    // NOTE: This extra check is very important!
    if (section === "start" || section === "finish") {
      return undefined;
    }

    return screenPreloadedFiles?.audio;
  }, [screenPreloadedFiles, section]);

  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const isAudioDisabled = useMemo<boolean>(() => {
    // NOTE: This extra check is very important!
    if (section === "start" || section === "finish") {
      return true;
    }

    if (!viewScreen?.type) {
      return true;
    }

    const isAudioDisabledForThisScreen =
      !audioEnabled[mapScreenTypeValuesToKeys[viewScreen.type]];

    return isAudioDisabledForThisScreen;
  }, [viewScreen?.type, section]);

  // - - - Music - - -

  /**
   * Music source represents the audio for one whole chapter
   */
  const [musicSrc, setMusicSrc] = useState<string | null>(null);

  const [musicRef, setMusicRef] = useState<HTMLAudioElement | null>(null);

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

  // - - - Expo sountrack audio - - -

  const [sountrackSrc, setSoundtrackSrc] = useState<string | null>(null);

  const [soundtrackRef, setSoundtrackRef] = useState<HTMLAudioElement | null>(
    null
  );

  const isSoundtrackDisabled = useMemo(() => {
    if (section === undefined) {
      return true;
    }
    if (section === "start" || section === "finish") {
      return true;
    }

    return false;
  }, [section]);

  // - - - Callbacks - - -

  const handleMount = useCallback(async () => {
    setIsScreenLoading(true);
    await handleViewScreen({ section, screen });
    setViewScreenIsLoaded(true);
    setIsScreenLoading(false);
  }, [handleViewScreen, screen, section, setViewScreenIsLoaded]);

  // - - - Effects - - -

  /**
   * 1.) Effect responsible for mounting this component
   */
  useEffect(() => {
    handleMount();
  }, [handleMount]);

  // - - - Effects (soundtrack) - - -

  /**
   * 2.) Effect responsible for setting `soundtrackSrc` (reacting to preloaded soundtrackUrl)
   */
  useEffect(() => {
    if (!soundtrackUrl) {
      return;
    }

    setSoundtrackSrc(soundtrackUrl);
  }, [soundtrackUrl]);

  /**
   * 3.) Effect responsible for automatic playing of 'soundtrackSrc', reacting to previous effect
   */
  useEffect(() => {
    if (!soundtrackRef) {
      return;
    }

    const shouldIncrement = store.getState().expo.viewProgress.shouldIncrement;
    if (!shouldIncrement) {
      return;
    }

    if (isSoundtrackDisabled) {
      return;
    }

    // TODO - nice feature to the future to adjust also this volume via AudioDialog
    const soundtrackVolume = 0.2;

    soundtrackRef.loop = true;
    soundtrackRef.volume = soundtrackVolume;
    soundtrackRef.play().catch((error) => {
      if (error instanceof Error && error.name === "NotAllowedError") {
        dispatch(setViewProgress({ shouldIncrement: false }));
      }
    });
  }, [sountrackSrc, soundtrackRef, isSoundtrackDisabled, dispatch]);

  /**
   * 4.) Effect responsible for pausing `soundtrackSrc`, when current screen does not support music playing
   */
  useEffect(() => {
    if (!soundtrackRef) {
      return;
    }

    if (isSoundtrackDisabled) {
      soundtrackRef.pause();
    } else {
      soundtrackRef.play();
    }
  }, [soundtrackRef, isSoundtrackDisabled]);

  // - - - Effects (music) - - -

  /**
   * 5.) Effect responsible for setting `musicSrc` (when section, chapter of this exposition changes)
   */
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
  }, [chapterMusicCache, section]);

  /**
   * 6.) Effect responsible for automatic playing of `musicSrc`, reacting to previous effect
   */
  useEffect(() => {
    if (!musicRef) {
      return;
    }

    const shouldIncrement = store.getState().expo.viewProgress.shouldIncrement;
    if (!shouldIncrement) {
      return;
    }

    const musicVolume =
      store.getState().expo.expoVolumes.musicVolume.actualVolume / 100;

    musicRef.loop = true;
    musicRef.volume = musicVolume;
    musicRef.play().catch((error) => {
      if (error instanceof Error && error.name === "NotAllowedError") {
        dispatch(setViewProgress({ shouldIncrement: false }));
      }
    });
  }, [musicSrc, musicRef, dispatch]);

  /**
   * 7.) Effect responsible for pausing `musicSrc`, when current screen does not support music playing
   */
  useEffect(() => {
    if (!musicRef) {
      return;
    }

    if (isMusicDisabled) {
      musicRef.pause();
    } else {
      musicRef.play();
    }
  }, [musicRef, isMusicDisabled]);

  // - - - Effects (audio) - - -

  /**
   * 8.) Effect responsible for automatic playing of `audioSrc`
   */
  useEffect(() => {
    if (!audioSrc) {
      return;
    }

    if (!audioRef) {
      return;
    }

    if (isAudioDisabled) {
      return;
    }

    const shouldIncrement = store.getState().expo.viewProgress.shouldIncrement;

    if (shouldIncrement) {
      const audioVolume =
        store.getState().expo.expoVolumes.speechVolume.actualVolume / 100;

      audioRef.volume = audioVolume;
      audioRef.play().catch((error) => {
        if (error instanceof Error && error.name === "NotAllowedError") {
          dispatch(setViewProgress({ shouldIncrement: false }));
        }
      });
    }

    return () => {
      audioRef.currentTime = 0;
      audioRef.pause();
    };
  }, [audioSrc, audioRef, isAudioDisabled, dispatch]);

  // - - - Effects (music + audio + soundtrack) - - -

  /**
   * 9.) Effect reponsible for muting all audio sources  (e.g. when mute button was pressed)
   */
  useEffect(() => {
    if (musicRef) {
      musicRef.volume = expoVolumes.musicVolume.actualVolume / 100;
    }

    if (audioRef) {
      audioRef.volume = expoVolumes.speechVolume.actualVolume / 100;
    }

    if (soundtrackRef) {
      // TODO
    }
  }, [expoVolumes, audioRef, musicRef, soundtrackRef]);

  /**
   * 10.) Effect responsible for pausing / playing  all audio sources (e.g. when pause/play button was pressed)
   */
  useEffect(() => {
    if (musicRef) {
      if (shouldIncrement && !isMusicDisabled) {
        musicRef.play().catch((error) => {
          if (error instanceof Error && error.name === "NotAllowedError") {
            dispatch(setViewProgress({ shouldIncrement: false }));
          }
        });
      }

      if (!shouldIncrement && !isMusicDisabled) {
        musicRef.pause();
      }
    }

    if (audioRef) {
      if (shouldIncrement) {
        audioRef.play().catch((error) => {
          if (error instanceof Error && error.name === "NotAllowedError") {
            dispatch(setViewProgress({ shouldIncrement: false }));
          }
        });
      } else {
        audioRef.pause();
      }
    }

    if (soundtrackRef) {
      if (shouldIncrement) {
        soundtrackRef.play().catch((error) => {
          if (error instanceof Error && error.name === "NotAllowedError") {
            dispatch(setViewProgress({ shouldIncrement: false }));
          }
        });
      } else {
        soundtrackRef.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldIncrement, audioRef, musicRef, soundtrackRef, dispatch]);

  // - - - GUI - - -

  return (
    <ScreenAutoNavigatorManager>
      {sountrackSrc && (
        <audio
          key={sountrackSrc}
          src={sountrackSrc}
          ref={(soundtrackRef) => setSoundtrackRef(soundtrackRef)}
        />
      )}

      {musicSrc && (
        <audio
          key={musicSrc}
          src={musicSrc}
          ref={(musicRef) => setMusicRef(musicRef)}
        />
      )}

      {/* NOTE: If audio is rendered, its audioSrc should always have source of the current screen! */}
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
        isSoundtrackLoading={isSoundtrackLoading}
        chapterMusicRef={musicRef}
        audioRef={audioRef}
        expoSoundtrackRef={soundtrackRef}
      />
    </ScreenAutoNavigatorManager>
  );
};
