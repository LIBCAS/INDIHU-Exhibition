import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Custom Hooks
import { useFilePreloader } from "context/file-preloader/file-preloader-provider";

// Components
import { Viewers } from "../views";

// Actions and utils
import { noop } from "lodash";

// Types and Enums
import { AppState } from "store/store";
import {
  audioEnabled,
  mapScreenTypeValuesToKeys,
  musicEnabled,
} from "enums/screen-type";
import { useSectionScreenParams } from "hooks/view-hooks/section-screen-hook";
import ScreenAutoNavigatorManager from "./expo-managers/ScreenAutoNavigatorManager";

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
    <ScreenAutoNavigatorManager>
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
    </ScreenAutoNavigatorManager>
  );
};
