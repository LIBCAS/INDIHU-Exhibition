import React from "react";
import { withRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

import ScreenStart from "./editors/ScreenStart";
import ScreenChapterStart from "./editors/ScreenChapterStart";
import ScreenImage from "./editors/ScreenImage";
import ScreenGameFind from "./editors/ScreenGameFind";
import ScreenVideo from "./editors/ScreenVideo";
import ScreenZoomIn from "./editors/ScreenZoomIn";
import ScreenPhotogallery from "./editors/ScreenPhotogallery";
import ScreenParallax from "./editors/ScreenParallax";
import ScreenText from "./editors/ScreenText";
import ScreenGameDraw from "./editors/ScreenGameDraw";
import ScreenGameWipe from "./editors/ScreenGameWipe";
import ScreenImageChange from "./editors/ScreenImageChange";
import ScreenGameSizing from "./editors/ScreenGameSizing";
import ScreenGameMove from "./editors/ScreenGameMove";
import ScreenGameOptions from "./editors/ScreenGameOptions";
import ScreenExternal from "./editors/ScreenExternal";

import {
  loadScreen,
  updateScreenData
} from "../actions/expoActions/screenActions";
import { screenUrl } from "../enums/screenType";

// URL/expo/{id}/screen/{type}/{position}/{tab}
const ExpoEditor = props => {
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
            path={`${match.url}/${screenUrl.PHOTOGALERY}/:position`}
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
        activeScreen
      }
    }) => ({
      url,
      activeScreen
    }),
    {
      loadScreen,
      updateScreenData
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
    }
  })
)(ExpoEditor);
