import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { ScreenPreloadedFiles } from "context/file-preloader/file-preloader-provider";

import { TutorialProvider } from "context/tutorial-provider/tutorial-provider";

import { ViewScreenOverlay } from "./view-screen-overlay/view-screen-overlay";

import { ViewLoading } from "./view-loading/view-loading";
import ViewError from "./view-error";

import { ViewStart } from "./view-start/view-start";
import { ViewFinish } from "./view-finish/view-finish";
import { ViewChapter } from "./view-chapter/view-chapter";
import { ViewImage } from "./view-image/view-image";
import { ViewVideo } from "./view-video/view-video";
import { ViewText } from "./view-text/view-text";
import { ViewParallax } from "./view-parallax/view-parallax";
import { ViewZoom } from "./view-zoom/view-zoom";
import { ViewSlideshow } from "./view-slideshow/view-slideshow";
import { ViewPhotogallery } from "./view-photogallery/view-photogallery";
import { ViewImageChange } from "./view-image-change/view-image-change";
import ViewExternal from "./view-external/view-external";
import { ViewSignpost } from "./view-signpost/view-signpost";
import { GameFind } from "./games/game-find/game-find";
import { GameDraw } from "./games/game-draw/game-draw";
import { GameErase } from "./games/game-erase/game-erase";
import { GameSizing } from "./games/game-sizing/game-sizing";
import { GameMove } from "./games/game-move/game-move";
import { GameQuiz } from "./games/game-quiz/game-quiz";

import { AppDispatch, AppState } from "store/store";
import { screenType } from "../../enums/screen-type";
import { ScreenProps } from "models";

import { setViewProgress } from "actions/expoActions/viewer-actions";

// - - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  (viewScreen) => ({ viewScreen })
);

const resolveScreenComponent = (
  type: typeof screenType[keyof typeof screenType]
): React.FC<ScreenProps> | undefined => {
  switch (type) {
    case screenType.START:
      return ViewStart;
    case screenType.FINISH:
      return ViewFinish;
    case screenType.INTRO:
      return ViewChapter;
    case screenType.IMAGE:
      return ViewImage;
    case screenType.VIDEO:
      return ViewVideo;
    case screenType.TEXT:
      return ViewText;
    case screenType.PARALLAX:
      return ViewParallax;
    case screenType.IMAGE_ZOOM:
      return ViewZoom;
    case screenType.SLIDESHOW:
      return ViewSlideshow;
    case screenType.PHOTOGALLERY_NEW:
      return ViewPhotogallery;
    case screenType.IMAGE_CHANGE:
      return ViewImageChange;
    case screenType.EXTERNAL:
      return ViewExternal;
    case screenType.SIGNPOST:
      return ViewSignpost;
    case screenType.GAME_FIND:
      return GameFind;
    case screenType.GAME_DRAW:
      return GameDraw;
    case screenType.GAME_WIPE:
      return GameErase;
    case screenType.GAME_SIZING:
      return GameSizing;
    case screenType.GAME_MOVE:
      return GameMove;
    case screenType.GAME_OPTIONS:
      return GameQuiz;
  }
};

// - - - - - - - -

type ViewersProps = {
  isScreenLoading: boolean;
  screenPreloadedFiles: ScreenPreloadedFiles | undefined;
  areScreenFilesLoading: boolean;
  isMusicLoading: boolean;
  chapterMusicRef: HTMLAudioElement | null;
  audioRef: HTMLAudioElement | null;
};

export const Viewers = ({
  isScreenLoading,
  screenPreloadedFiles,
  areScreenFilesLoading,
  isMusicLoading,
  chapterMusicRef,
  audioRef,
}: ViewersProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  /* Set the viewProgress.screenFilesLoading to true if screenPreloadedFiles === undefined, thus not loaded yet! */
  useEffect(() => {
    dispatch(setViewProgress({ screenFilesLoading: !screenPreloadedFiles }));
  }, [dispatch, screenPreloadedFiles]);

  /* isScreenLoading is state from ViewScreen, set to true after ViewScreen is mounted! */
  /* if ViewScreen was not fully loaded or viewScreen from redux is not retrieved.. return empty FC */
  /* Otherwise.. set to the ScreenComponent the component or the appropriate Screen Type! */
  const ScreenComponent = useMemo(() => {
    if (isScreenLoading || !viewScreen) {
      return null;
    }

    return resolveScreenComponent(viewScreen.type);
  }, [isScreenLoading, viewScreen]);

  // Means that setting the redux store.expo.viewScreen failed, e.g because of invalid section, screen params
  if (!ScreenComponent || !viewScreen) {
    return <ViewError />;
  }

  return (
    <TutorialProvider>
      <ViewScreenOverlay chapterMusicRef={chapterMusicRef} audioRef={audioRef}>
        {(infoPanelRef, actionsPanelRef, isMobileOverlay) =>
          !screenPreloadedFiles ||
          isScreenLoading ||
          isMusicLoading ||
          areScreenFilesLoading ? (
            <ViewLoading />
          ) : (
            <ScreenComponent
              screenPreloadedFiles={screenPreloadedFiles}
              infoPanelRef={infoPanelRef}
              actionsPanelRef={actionsPanelRef}
              chapterMusicRef={chapterMusicRef}
              isMobileOverlay={isMobileOverlay}
            />
          )
        }
      </ViewScreenOverlay>
    </TutorialProvider>
  );
};
