import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useRouteMatch, useLocation, Route } from "react-router-dom";

import ScreenStart from "./screen-start/screen-start";
import ScreenChapterStart from "./screen-chapter-start/screen-chapter-start";
import ScreenImage from "./screen-image/screen-image";
import ScreenText from "./screen-text/screen-text";
import ScreenVideo from "./screen-video/screen-video";
import ScreenZoomIn from "./screen-zoom-in/screen-zoom-in";
import ScreenImageChange from "./screen-image-change/screen-image-change";
import ScreenSlideshow from "./screen-slideshow/screen-slideshow";
import ScreenPhotogallery from "./screen-photogallery/screen-photogallery-new";
import ScreenParallax from "./screen-parallax/screen-parallax";
import ScreenExternal from "./screen-external/screen-external";
import ScreenSignpost from "./screen-signpost/screen-signpost";
import ScreenGameFind from "./screen-game-find/screen-game-find";
import ScreenGameDraw from "./screen-game-draw/screen-game-draw";
import ScreenGameWipe from "./screen-game-wipe/screen-game-wipe";
import ScreenGameSizing from "./screen-game-sizing/screen-game-sizing";
import ScreenGameMove from "./screen-game-move/screen-game-move";
import ScreenGameOptions from "./screen-game-options/screen-game-options";
import ScreenFinish from "./screen-finish/screen-finish";

import { AppState } from "store/store";
import { AppDispatch } from "store/store";
import { ActiveExpo, Screen } from "models";

import { loadScreen, updateScreenData } from "actions/expoActions";
import { screenUrl } from "enums/screen-type";
import { isEmpty } from "lodash";

const expoStateSelector = createSelector(
  ({ expo }: AppState) => expo.activeScreen as Screen,
  (activeScreen) => ({ activeScreen })
);

// - -

type ExpoEditorProps = {
  activeExpo: ActiveExpo;
};

// URL/expo/{id}/screen/{type}/{position}/{tab}
const ExpoEditor = ({ activeExpo }: ExpoEditorProps) => {
  const { activeScreen } = useSelector(expoStateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const match = useRouteMatch();
  const location = useLocation();

  useEffect(() => {
    const handleExpoEditorMount = async () => {
      await dispatch(loadScreen(location.pathname));
    };
    handleExpoEditorMount();

    return () => {
      const handleExpoEditorUnmount = async () => {
        await dispatch(updateScreenData(null));
      };
      handleExpoEditorUnmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  const editorProps = {
    activeExpo: activeExpo,
    activeScreen: activeScreen,
    url: activeExpo.url,
  };

  if (!activeScreen || isEmpty(activeScreen) || !activeScreen.type) {
    return null;
  }

  return (
    <div>
      <Route
        path={`${match.url}/${screenUrl.START}`}
        render={() => <ScreenStart {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.FINISH}`}
        render={() => <ScreenFinish {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.INTRO}/:position`}
        render={() => <ScreenChapterStart {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.IMAGE}/:position`}
        render={() => <ScreenImage {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.GAME_FIND}/:position`}
        render={() => <ScreenGameFind {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.VIDEO}/:position`}
        render={() => <ScreenVideo {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.IMAGE_ZOOM}/:position`}
        render={() => <ScreenZoomIn {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.SLIDESHOW}/:position`}
        render={() => <ScreenSlideshow {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.PHOTOGALLERY_NEW}/:position`}
        render={() => <ScreenPhotogallery {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.PARALLAX}/:position`}
        render={() => <ScreenParallax {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.TEXT}/:position`}
        render={() => <ScreenText {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.GAME_DRAW}/:position`}
        render={() => <ScreenGameDraw {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.GAME_WIPE}/:position`}
        render={() => <ScreenGameWipe {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.IMAGE_CHANGE}/:position`}
        render={() => <ScreenImageChange {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.GAME_SIZING}/:position`}
        render={() => <ScreenGameSizing {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.GAME_MOVE}/:position`}
        render={() => <ScreenGameMove {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.GAME_OPTIONS}/:position`}
        render={() => <ScreenGameOptions {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.EXTERNAL}/:position`}
        render={() => <ScreenExternal {...editorProps} />}
      />
      <Route
        path={`${match.url}/${screenUrl.SIGNPOST}/:position`}
        render={() => <ScreenSignpost {...editorProps} />}
      />
    </div>
  );
};

export default ExpoEditor;
