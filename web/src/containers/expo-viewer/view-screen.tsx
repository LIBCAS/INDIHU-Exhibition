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
import { useQuery } from "hooks/use-query";
import { useExpoNavigation } from "../views/hooks/expo-navigation-hook";

// Components
import { Viewers } from "../views";

// Actions and utils
import { setViewProgress } from "actions/expoActions/viewer-actions";

// Types and Enums
import { AppState } from "store/store";
import {
  audioEnabled,
  automaticRouting,
  musicEnabled,
} from "enums/screen-type";
import { noop } from "lodash";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  ({ expo }: AppState) => expo.expoVolumes,
  (viewExpo, viewScreen, shouldIncrement, expoVolumes) => ({
    viewExpo,
    viewScreen,
    shouldIncrement,
    expoVolumes,
  })
);

interface NewViewScreenProps {
  name: string;
  handleScreen: ({ section, screen }: any) => Promise<any>;
  setViewScreenIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewViewScreen = ({
  handleScreen,
  setViewScreenIsLoaded,
}: NewViewScreenProps) => {
  const { viewScreen, shouldIncrement, expoVolumes } =
    useSelector(stateSelector);
  const dispatch = useDispatch();

  const { params } = useRouteMatch<{ section: string; screen: string }>();
  const { screen, section } = params;

  const query = useQuery();

  const { screenPreloadedFiles } = useFilePreloader();

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const musicSrc = useMemo(() => screenPreloadedFiles?.music, [section]);
  const [musicSrc, setMusicSrc] = useState<string | null>(null);
  const musicRef = useRef<HTMLAudioElement>(null);

  const previousSection = useRef<string>("");
  const previousMusicSrc = useRef<string | null>(null);

  // - -

  const handleMount = useCallback(async () => {
    setIsScreenLoading(true);
    await handleScreen({ section, screen });
    setViewScreenIsLoaded(true);
    setIsScreenLoading(false);
  }, [handleScreen, screen, section, setViewScreenIsLoaded]);

  /* 1.) Mount this NewViewScreen in ViewScreen.tsx */
  useEffect(() => {
    handleMount();
  }, [handleMount]);

  // 2.) According to the viewScreen.type ("INTRO", "START", ... ) set appropriate viewProgress.shouldRedirect
  // shouldRedirect is false only for START and FINISH screens (GAME screen are true after upgrade)
  // shouldRedirect is also false if ?preview=true query is present in URL
  // This shouldRedirect is then used in the wrappering ScreenAutoNavigator component below, at the bottom of this file
  useEffect(() => {
    if (!viewScreen?.type) {
      return;
    }

    const shouldRedirect =
      !query.get("preview") &&
      !!automaticRouting[viewScreen.type as keyof typeof automaticRouting];
    dispatch(setViewProgress({ shouldRedirect }));
  }, [dispatch, query, viewScreen?.type]);

  // - - -

  /* Effect which stores the section of the previous screen into ref variable */
  useEffect(() => {
    return () => {
      previousSection.current = section;
    };
  }, [section]);

  /* Effect which actualizes the musicSrc when the current screen has the chapter music set! */
  useEffect(() => {
    if (!screenPreloadedFiles?.music) {
      return;
    }

    setMusicSrc(screenPreloadedFiles.music);
  }, [screenPreloadedFiles]);

  /* Effect which stores the music of previous section into ref variable */
  useEffect(() => {
    return () => {
      previousMusicSrc.current = musicSrc;
    };
  }, [musicSrc]);

  /* Effect which handles automatic playing of new music OR pausing if current screen does not support music playing */
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
    if (!viewScreen) {
      return;
    }

    const isMusicDisabled =
      ("muteChapterMusic" in viewScreen && viewScreen.muteChapterMusic) ||
      !musicEnabled[viewScreen.type as keyof typeof musicEnabled];

    if (isMusicDisabled && musicRef.current) {
      musicRef.current.pause();
    }
  }, [viewScreen]);

  /* Effect which handles automatic playing of current screen audio + when going to new screen.. pause and rewind old audio */
  useEffect(() => {
    if (!viewScreen || !audioRef.current) {
      return;
    }
    // E.g not to play the audio verze vystavy on the start screen!
    const isAudioDisabled =
      !audioEnabled[viewScreen.type as keyof typeof audioEnabled];

    if (isAudioDisabled) {
      return;
    }

    const audio = audioRef.current;
    if (shouldIncrement) {
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
      if (shouldIncrement) {
        music.play();
      } else {
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
  }, [shouldIncrement]);

  // If came back to the start screen.. or came back to the previous section.. stop playing music of the section
  // Setting the musicSrc to null will not render the second <audio> and the musicRef.current === null
  useEffect(() => {
    if (section === "start" || section === "finish") {
      setMusicSrc(null);
      return;
    }

    const previousSectionParsed = parseInt(previousSection.current);
    const sectionParsed = parseInt(section);
    if (isNaN(previousSectionParsed) || isNaN(sectionParsed)) {
      return;
    }
    // Moving backwards
    if (previousSectionParsed > sectionParsed) {
      setMusicSrc(null);
    }
  }, [section]);

  // - -

  return (
    <ScreenAutoNavigator>
      {/* If rendered -- <audio> will always have source of the current screen audio!!! */}
      {musicSrc && <audio src={musicSrc} ref={musicRef} />}
      {audioSrc && <audio src={audioSrc} ref={audioRef} />}
      <Viewers
        isScreenLoading={isScreenLoading}
        screenPreloadedFiles={screenPreloadedFiles}
        chapterMusicRef={musicRef}
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
