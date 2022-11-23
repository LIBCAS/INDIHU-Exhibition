import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { createSelector } from "reselect";

import { Viewers } from "../views";
import { useExpoNavigation } from "../views/hooks/expo-navigation-hook";
import {
  audioEnabled,
  automaticRouting,
  musicEnabled,
} from "enums/screen-type";
import { AppState } from "store/store";
import {
  setChapterMusic,
  setLastChapter,
  setScreenAudio,
  setViewProgress,
} from "actions/expoActions/viewer-actions";
import { useFilePreloader } from "context/file-preloader/file-preloader-context";
import { useQuery } from "hooks/use-query";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.viewChapterMusic,
  ({ expo }: AppState) => expo.viewScreenAudio,
  ({ expo }: AppState) => expo.viewLastChapter,
  ({ expo }: AppState) => expo.preloadedFiles,
  ({ expo }: AppState) => expo.soundIsTurnedOff,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (
    viewExpo,
    viewScreen,
    viewChapterMusic,
    viewScreenAudio,
    viewLastChapter,
    preloadedFiles,
    soundIsTurnedOff,
    shouldIncrement
  ) => ({
    viewExpo,
    viewScreen,
    viewChapterMusic,
    viewScreenAudio,
    viewLastChapter,
    preloadedFiles,
    soundIsTurnedOff,
    shouldIncrement,
  })
);

interface Props {
  name: string;
  handleScreen: ({ section, screen }: any) => Promise<any>;
  setViewScreenIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewViewScreen = ({
  handleScreen,
  setViewScreenIsLoaded,
}: Props) => {
  const {
    preloadedFiles,
    soundIsTurnedOff,
    viewChapterMusic,
    viewExpo,
    viewLastChapter,
    shouldIncrement,
    viewScreenAudio,
    viewScreen,
  } = useSelector(stateSelector);
  const query = useQuery();
  const dispatch = useDispatch();
  const { params } = useRouteMatch<{ section: string; screen: string }>();
  const { screen, section } = params;
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const { screenFiles } = useFilePreloader();
  const audioRef = useRef<HTMLAudioElement>(null);

  // useScreenAutoNavigatioon();

  const audioSrc = useMemo(() => screenFiles?.audio, [screenFiles]);

  const handleMount = useCallback(async () => {
    setIsScreenLoading(true);
    await handleScreen({ section, screen });
    setViewScreenIsLoaded(true);
    setIsScreenLoading(false);
  }, [handleScreen, screen, section, setViewScreenIsLoaded]);

  useEffect(() => {
    if (!viewScreen?.type) {
      return;
    }

    const shouldRedirect =
      !query.get("preview") &&
      !!automaticRouting[viewScreen.type as keyof typeof automaticRouting];
    dispatch(setViewProgress({ shouldRedirect }));
  }, [dispatch, query, viewScreen?.type]);

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  useEffect(() => {
    return () => {
      viewScreenAudio?.pause();
      dispatch(setScreenAudio(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!viewScreen) {
      return;
    }

    const musicOff =
      ("muteChapterMusic" in viewScreen && viewScreen.muteChapterMusic) ||
      soundIsTurnedOff ||
      !musicEnabled[viewScreen.type as keyof typeof musicEnabled];

    if (isEmpty(viewExpo) || viewLastChapter === section) {
      if (viewChapterMusic) {
        viewChapterMusic.volume = musicOff ? 0 : 0.2;
      }
      return;
    }

    viewChapterMusic?.pasue();
    const music = preloadedFiles?.[section]?.[0]?.["music"];
    if (music) {
      music.loop = true;
      music.volume = musicOff ? 0 : 0.2;
      music.play();
    }

    setChapterMusic(music ? music : null);
    setLastChapter(section);
  }, [
    preloadedFiles,
    section,
    soundIsTurnedOff,
    viewChapterMusic,
    viewExpo,
    viewLastChapter,
    viewScreen,
  ]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audioSrc || !audio) {
      return;
    }

    audio.volume = soundIsTurnedOff ? 0 : 1;
  }, [audioSrc, soundIsTurnedOff]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audioSrc || !audio || !viewScreen) {
      return;
    }

    const shouldPlayAudio =
      audioEnabled[viewScreen.type as keyof typeof audioEnabled];

    if (!shouldIncrement || !shouldPlayAudio) {
      audio.pause();
      return;
    }

    audio.play();
  }, [audioSrc, shouldIncrement, viewScreen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audioSrc || !audio) {
      return;
    }

    setScreenAudio(audio);

    return () => {
      audio.currentTime = 0;
      audio.pause();
    };
  }, [audioSrc]);

  return (
    <ScreenAutoNavigator>
      {audioSrc && <audio src={audioSrc} ref={audioRef} />}
      <Viewers isScreenLoading={isScreenLoading} />
    </ScreenAutoNavigator>
  );
};

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
    if (!timeRanOut || !shouldRedirect) return;

    navigateForward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRanOut, shouldRedirect]);

  return <>{children}</>;
};
