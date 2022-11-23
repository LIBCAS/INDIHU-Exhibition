import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { AppDispatch, AppState } from "store/store";
import { useFilePreloader } from "context/file-preloader/file-preloader-context";
import { setViewProgress } from "actions/expoActions/viewer-actions";

import { ViewChapter } from "./view-chapter/view-chapter";
import { ViewImage } from "./view-image/view-image";
import { ViewVideo } from "./view-video/view-video";
import ViewText from "./view-text";
import { ViewParallax } from "./view-parallax/view-parallax";
import { ViewZoom } from "./view-zoom/view-zoom";
import { ViewPhotogallery } from "./view-photogallery/view-photogallery";
import { ViewImageChange } from "./view-image-change/view-image-change";
import ViewExternal from "./view-external";
import { GameFind } from "./games/game-find/game-find";
import { GameDraw } from "./games/game-draw/game-draw";
import { GameErase } from "./games/game-erase/game-erase";
import { GameSizing } from "./games/game-sizing/game-sizing";
import { GameMove } from "./games/game-move/game-move";
import { GameQuiz } from "./games/game-quiz/game-quiz";
import ViewError from "./view-error";
import { screenType } from "../../enums/screen-type";
import { ViewScreenOverlay } from "./view-screen-overlay/view-screen-overlay";
import { ViewLoading } from "./view-loading/view-loading";
import { ViewStart } from "./view-start/view-start";
import { ViewFinish } from "./view-finish/view-finish";
import { ScreenProps } from "./types";
import { TutorialStoreProvider } from "components/tutorial/tutorial-store";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  (viewScreen) => ({ viewScreen })
);

const resolveScreenComponent = (
  type: keyof typeof screenType
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
    case screenType.PHOTOGALERY:
      return ViewPhotogallery;
    case screenType.IMAGE_CHANGE:
      return ViewImageChange;
    case screenType.EXTERNAL:
      return ViewExternal;
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

type Props = {
  isScreenLoading: boolean;
};

export const Viewers = ({ isScreenLoading }: Props) => {
  const { viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { screenFiles } = useFilePreloader();

  useEffect(() => {
    dispatch(setViewProgress({ screenFilesLoading: !screenFiles }));
  }, [dispatch, screenFiles]);

  const ScreenComponent = useMemo(
    () =>
      isScreenLoading || !viewScreen
        ? () => <></>
        : resolveScreenComponent(viewScreen.type),
    [isScreenLoading, viewScreen]
  );

  const hiddenOverlay = useMemo(
    () => viewScreen?.type === "START" || viewScreen?.type === "FINISH",
    [viewScreen?.type]
  );

  if (!ScreenComponent) {
    return <ViewError />;
  }

  return (
    <TutorialStoreProvider>
      <ViewScreenOverlay hidden={hiddenOverlay}>
        {(toolbarRef) =>
          !screenFiles || isScreenLoading || !viewScreen ? (
            <ViewLoading />
          ) : (
            <ScreenComponent
              screenFiles={screenFiles}
              toolbarRef={toolbarRef}
            />
          )
        }
      </ViewScreenOverlay>
    </TutorialStoreProvider>
  );
};
