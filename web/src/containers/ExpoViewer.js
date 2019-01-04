import React from "react";
import { connect } from "react-redux";
import { withRouter, Route } from "react-router-dom";
import { isEmpty, get } from "lodash";
import { compose, lifecycle, withHandlers, withState } from "recompose";
import { Helmet } from "react-helmet";

import ViewWrap from "../components/views/ViewWrap";
import ViewStart from "./views/ViewStart";
import ViewFinish from "./views/ViewFinish";
import ViewError from "./views/ViewError";
import ViewNotPublic from "./views/ViewNotPublic";
import InteractiveScreen from "./views/InteractiveScreen";
import Viewers from "./views";
import Progress from "../components/Progress";

import {
  loadExposition,
  loadScreen,
  setChapterMusic,
  setScreenAudio,
  setLastChapter,
  filePreloader,
  turnSoundOff
} from "../actions/expoActions/viewerActions";

import { automaticRouting, screenUrl } from "../enums/screenType";
import {
  nextViewType,
  prevViewType,
  viewerRouter,
  motionVolume
} from "../utils";

/** SCREEN */

const ViewScreen = compose(
  withRouter,
  withState("stateMotionVol", "setStateMotionVol", false),
  withState("stateTimeout", "setStateTimeout", null),
  connect(
    ({
      expo: {
        viewExpo,
        viewChapterMusic,
        viewScreenAudio,
        viewLastChapter,
        preloadedFiles,
        soundIsTurnedOff
      }
    }) => ({
      viewExpo,
      viewChapterMusic,
      viewScreenAudio,
      viewLastChapter,
      preloadedFiles,
      soundIsTurnedOff
    }),
    { setChapterMusic, setLastChapter, setScreenAudio }
  ),
  lifecycle({
    async componentWillMount() {
      const {
        history,
        name,
        section,
        screen,
        handleScreen,
        viewExpo,
        preloadedFiles,
        viewChapterMusic,
        setChapterMusic,
        viewLastChapter,
        setLastChapter,
        setScreenAudio,
        setStateTimeout,
        setStateMotionVol,
        soundIsTurnedOff
      } = this.props;
      /** load screen data */
      const viewScreen = await handleScreen({ section, screen });
      const screenFiles = preloadedFiles[section][screen];
      let muteMusicForScreen = false;

      /** change chapter music */
      if (!isEmpty(viewExpo) && viewLastChapter !== section) {
        if (viewChapterMusic) {
          viewChapterMusic.pause();
        }

        if (get(viewExpo.structure.screens[section], "[0].music")) {
          const music = preloadedFiles[section][0]["music"];
          music.loop = true;
          music.volume = soundIsTurnedOff ? 0 : 0.2;
          music.play();
          setChapterMusic(music);
        } else {
          setChapterMusic(null);
        }
        setLastChapter(section);
      }

      /** prepare routing */
      if (automaticRouting[viewScreen.type]) {
        setStateTimeout(
          setTimeout(() => {
            history.push(viewerRouter(name, viewExpo, section, screen, true));
          }, viewScreen.time && viewScreen.time > 0 ? viewScreen.time * 1000 : 20000)
        );

        /** set screen audio */
        if (viewScreen && viewScreen.audio) {
          const audio = screenFiles["audio"];
          audio.currentTime = 0;
          audio.volume = soundIsTurnedOff ? 0 : 1;
          audio.play();
          setScreenAudio(audio);
        } else {
          setScreenAudio(null);
        }
      } else {
        /** motion volume for games and video */
        muteMusicForScreen = true;
      }

      /** muteChapterMusic for screen */
      if (viewScreen && viewScreen.muteChapterMusic) muteMusicForScreen = true;

      /** mute chapter music for screen */
      if (muteMusicForScreen && viewChapterMusic) {
        motionVolume(viewChapterMusic, soundIsTurnedOff ? 0 : 0.2, 0);
        if (automaticRouting[nextViewType(viewExpo, section, screen)])
          setStateMotionVol(true);
      }
    },
    componentWillUnmount() {
      const {
        viewScreenAudio,
        stateTimeout,
        viewChapterMusic,
        stateMotionVol,
        soundIsTurnedOff
      } = this.props;

      if (viewChapterMusic && stateMotionVol) {
        motionVolume(viewChapterMusic, 0, soundIsTurnedOff ? 0 : 0.2);
      }

      if (viewScreenAudio) {
        viewScreenAudio.pause();
        setScreenAudio(null);
      }

      clearTimeout(stateTimeout);
    }
  }),
  withHandlers({
    getNextUrlPart: ({
      name,
      viewExpo,
      section,
      screen,
      setStateMotionVol
    }) => () => {
      if (automaticRouting[nextViewType(viewExpo, section, screen)])
        setStateMotionVol(true);
      return viewerRouter(name, viewExpo, section, screen, true);
    },
    getPrevUrlPath: ({
      name,
      viewExpo,
      section,
      screen,
      setStateMotionVol
    }) => () => {
      if (automaticRouting[prevViewType(viewExpo, section, screen)])
        setStateMotionVol(true);
      return viewerRouter(name, viewExpo, section, screen, false);
    }
  })
)(({ name, section, screen, getNextUrlPart, getPrevUrlPath }) =>
  <Viewers {...{ name, section, screen, getNextUrlPart, getPrevUrlPath }} />
);

/** INTERACTIVITY */

const ViewInteractivity = compose(
  withRouter,
  connect(
    ({ expo: { viewInteractive, preloadedFiles } }) => ({
      viewInteractive,
      preloadedFiles
    }),
    null
  )
)(({ viewInteractive, preloadedFiles, match, name, section, handleScreen }) => {
  const screen = match.params.screen;
  const screenFiles = preloadedFiles[section][screen];

  if (viewInteractive)
    return (
      <InteractiveScreen
        {...{ name, section, screen, handleScreen, screenFiles }}
      />
    );

  return (
    <ViewScreen {...{ name, section, screen, handleScreen, screenFiles }} />
  );
});

/** SECTION */

const ViewSection = compose(
  withRouter,
  connect(
    ({ expo: { preloadedFiles, viewChapterMusic } }) => ({
      preloadedFiles,
      viewChapterMusic
    }),
    { setChapterMusic }
  ),
  lifecycle({
    async componentWillMount() {
      const { match, handleScreen } = this.props;
      const section = match.params.section;
      if (section === screenUrl.START || section === screenUrl.FINISH)
        await handleScreen({ section });
    }
  })
)(props => {
  const {
    match,
    location,
    name,
    handleScreen,
    viewScreen,
    preloadedFiles,
    viewChapterMusic,
    setChapterMusic
  } = props;

  const section = match.params.section;

  if (section === screenUrl.START)
    return <ViewStart {...{ screenFiles: preloadedFiles[screenUrl.START] }} />;
  else if (section === screenUrl.FINISH) {
    if (viewChapterMusic) {
      viewChapterMusic.pause();
      setChapterMusic(null);
    }
    return (
      <ViewFinish
        {...{ handleScreen, screenFiles: preloadedFiles[screenUrl.FINISH] }}
      />
    );
  } else if (match.url === location.pathname) return <ViewError />;

  return (
    <Route
      path={`${match.url}/:screen`}
      render={({ match }) =>
        <ViewInteractivity
          key={`${section}-${match.params.screen}`} // must be there
          viewScreen={viewScreen} // must be there
          name={name} // ok
          section={section} // ok
          handleScreen={handleScreen} // ok
        />}
    />
  );
});

/** VIEWER */

export default compose(
  withRouter,
  withState("prepared", "setPrepared", false),
  connect(
    ({ expo: { viewExpo, viewScreen, viewInteractive } }) => ({
      viewExpo,
      viewScreen,
      viewInteractive
    }),
    {
      loadExposition,
      loadScreen,
      filePreloader,
      turnSoundOff
    }
  ),
  lifecycle({
    async componentWillMount() {
      const {
        match,
        location,
        history,
        loadExposition,
        filePreloader,
        setPrepared
      } = this.props;
      const viewExpo = await loadExposition(match.params.name);

      if (viewExpo && match.url.replace(/^\/view\//, "") !== viewExpo.url) {
        const newUrl = location.pathname.replace(
          new RegExp(
            `^${match.url.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1")}`,
            "g"
          ),
          `/view/${viewExpo.url}`
        );

        history.replace(
          newUrl === `/view/${viewExpo.url}` ||
          newUrl === `/view/${viewExpo.url}/`
            ? `${newUrl.replace(/\/$/g, "")}/start`
            : newUrl
        );
      } else if (match.url === location.pathname) {
        history.replace(`${match.url.replace(/\/$/g, "")}/start`);
      }

      await filePreloader();
      setPrepared(true);
    },
    componentWillUnmount() {
      const { turnSoundOff } = this.props;

      turnSoundOff(false);
    }
  }),
  withHandlers({
    handleScreen: ({ loadScreen, history, match }) => async ({
      section,
      screen
    }) => {
      const viewScreen = await loadScreen(section, screen);

      if (!viewScreen) {
        history.push(`${match.url}/error`);
        return null;
      }
      return viewScreen;
    }
  })
)(
  ({
    match,
    handleScreen,
    viewExpo,
    viewScreen,
    prepared,
    viewInteractive
  }) => {
    if (prepared) {
      if (viewExpo) {
        if (
          viewExpo.filesTotal &&
          (!viewExpo.filesLoaded || viewExpo.filesLoaded < viewExpo.filesTotal)
        ) {
          return (
            <Progress
              {...{
                percent: viewExpo.filesLoaded
                  ? viewExpo.filesLoaded / viewExpo.filesTotal * 100 < 100
                    ? viewExpo.filesLoaded / viewExpo.filesTotal * 100
                    : 100
                  : 0
              }}
            />
          );
        }

        return (
          <ViewWrap
            title={get(viewExpo, "title")}
            institution={get(viewExpo, "organization")}
            expoViewer={true}
            viewInteractive={viewInteractive}
          >
            <Helmet>
              <title>
                {viewExpo.title}
              </title>
              <meta
                name="description"
                content={get(viewExpo, "structure.start.perex")}
              />
            </Helmet>
            <Route
              path={`${match.url}/:section`}
              render={props =>
                <ViewSection
                  key={`expo-viewer-view-section-${get(
                    props,
                    "match.params.section"
                  )}`}
                  viewScreen={viewScreen} // must be there
                  name={match.params.name} // ok
                  handleScreen={handleScreen} // ok
                />}
            />
          </ViewWrap>
        );
      }
      return <ViewNotPublic />;
    }
    return <div />;
  }
);
