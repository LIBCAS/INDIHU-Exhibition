import { withRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

import ScreenStart from "./editors/screen-start/screen-start";
import ScreenChapterStart from "./editors/screen-chapter-start/screen-chapter-start";
import ScreenImage from "./editors/screen-image/screen-image";
import ScreenGameFind from "./editors/screen-game-find/screen-game-find";
import ScreenVideo from "./editors/screen-video/screen-video";
import ScreenZoomIn from "./editors/screen-zoom-in/screen-zoom-in";
import ScreenSlideshow from "./editors/screen-slideshow/screen-slideshow";
import ScreenPhotogallery from "./editors/screen-photogallery/screen-photogallery-new";
import ScreenParallax from "./editors/screen-parallax/screen-parallax";
import ScreenText from "./editors/screen-text/screen-text";
import ScreenGameDraw from "./editors/screen-game-draw/screen-game-draw";
import ScreenGameWipe from "./editors/screen-game-wipe/screen-game-wipe";
import ScreenImageChange from "./editors/screen-image-change/screen-image-change";
import ScreenGameSizing from "./editors/screen-game-sizing/screen-game-sizing";
import ScreenGameMove from "./editors/screen-game-move/screen-game-move";
import ScreenGameOptions from "./editors/screen-game-options/screen-game-options";
import ScreenExternal from "./editors/screen-external/screen-external";
import ScreenFinish from "./editors/screen-finish/screen-finish";

import {
  loadScreen,
  updateScreenData,
} from "../actions/expoActions/screen-actions";
import { screenUrl } from "../enums/screen-type";

// URL/expo/{id}/screen/{type}/{position}/{tab}
const ExpoEditor = (props) => {
  const { match, activeScreen } = props;

  return (
    <div>
      {activeScreen && activeScreen.type && (
        <div>
          <Route
            path={`${match.url}/${screenUrl.START}`}
            render={() => <ScreenStart {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.FINISH}`}
            render={() => <ScreenFinish {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.INTRO}/:position`}
            render={() => <ScreenChapterStart {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.IMAGE}/:position`}
            render={() => <ScreenImage {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.GAME_FIND}/:position`}
            render={() => <ScreenGameFind {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.VIDEO}/:position`}
            render={() => <ScreenVideo {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.IMAGE_ZOOM}/:position`}
            render={() => <ScreenZoomIn {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.SLIDESHOW}/:position`}
            render={() => <ScreenSlideshow {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.PHOTOGALLERY_NEW}/:position`}
            render={() => <ScreenPhotogallery {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.PARALLAX}/:position`}
            render={() => <ScreenParallax {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.TEXT}/:position`}
            render={() => <ScreenText {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.GAME_DRAW}/:position`}
            render={() => <ScreenGameDraw {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.GAME_WIPE}/:position`}
            render={() => <ScreenGameWipe {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.IMAGE_CHANGE}/:position`}
            render={() => <ScreenImageChange {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.GAME_SIZING}/:position`}
            render={() => <ScreenGameSizing {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.GAME_MOVE}/:position`}
            render={() => <ScreenGameMove {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.GAME_OPTIONS}/:position`}
            render={() => <ScreenGameOptions {...props} />}
          />
          <Route
            path={`${match.url}/${screenUrl.EXTERNAL}/:position`}
            render={() => <ScreenExternal {...props} />}
          />
        </div>
      )}
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({
      expo: {
        activeExpo: { url },
        activeScreen,
      },
    }) => ({
      url,
      activeScreen,
    }),
    {
      loadScreen,
      updateScreenData,
    }
  ),
  lifecycle({
    async componentDidMount() {
      const { location, loadScreen } = this.props;
      await loadScreen(location.pathname);
    },
    async componentWillUnmount() {
      const { updateScreenData } = this.props;
      await updateScreenData(null);
    },
  })
)(ExpoEditor);
