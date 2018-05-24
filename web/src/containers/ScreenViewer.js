import React from "react";
import { withRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { compose, lifecycle, withState } from "recompose";
import { Helmet } from "react-helmet";

import { loadExpo } from "../actions/expoActions";
import { getCurrentUser } from "../actions/userActions";
import {
  screenFilePreloader,
  setViewExpo,
  setViewScreen
} from "../actions/expoActions/viewerActions";
import { screenUrl } from "../enums/screenType";

import ViewWrap from "../components/views/ViewWrap";
import ViewStart from "./views/ViewStart";
import ViewFinish from "./views/ViewFinish";
import ViewError from "./views/ViewError";
import Viewers from "./views";
import InteractiveScreen from "./views/InteractiveScreen";

/** TODO refactor */
const ViewScreen = compose(
  withRouter,
  withState("prepared", "setPrepared", false),
  withState("stateMusic", "setStateMusic", null),
  withState("stateAudio", "setStateAudio", null),
  connect(
    ({
      expo: { activeExpo, preloadedFiles, viewScreen, viewInteractive }
    }) => ({
      activeExpo,
      preloadedFiles,
      viewScreen,
      viewInteractive
    }),
    { screenFilePreloader, setViewScreen }
  ),
  lifecycle({
    async componentWillMount() {
      const {
        match,
        section,
        activeExpo,
        setStateMusic,
        setStateAudio,
        screenFilePreloader,
        setViewScreen,
        setPrepared
      } = this.props;
      const screen = match.params.screen;
      const viewScreen = activeExpo.structure.screens[section][screen] || {};

      setViewScreen(viewScreen);
      const preloadedFiles = await screenFilePreloader(
        viewScreen,
        section,
        screen
      );
      setPrepared(true);

      /** chapter music */
      if (preloadedFiles.music) {
        const music = preloadedFiles.music;
        music.loop = true;
        music.volume = 0.2;
        music.play();
        setStateMusic(music);
      }

      /** screen audio */
      if (preloadedFiles.audio) {
        const audio = preloadedFiles.audio;
        audio.currentTime = 0;
        audio.play();
        setStateAudio(audio);
      }
    },
    componentWillUnmount() {
      const { stateMusic, stateAudio } = this.props;

      if (stateMusic) stateMusic.pause();

      if (stateAudio) stateAudio.pause();
    }
  })
)(({ prepared, preloadedFiles, viewInteractive }) => {
  if (prepared) {
    if (viewInteractive)
      return (
        <InteractiveScreen
          {...{ screenViewer: true, screenFiles: preloadedFiles }}
        />
      );

    return <Viewers sFiles={preloadedFiles} />;
  }
  return <div />;
});

const ViewSection = compose(
  withRouter,
  withState("prepared", "setPrepared", false),
  connect(
    ({ expo: { activeExpo, preloadedFiles } }) => ({
      activeExpo,
      preloadedFiles
    }),
    { screenFilePreloader, setViewExpo, setViewScreen }
  ),
  lifecycle({
    async componentWillMount() {
      const {
        match,
        activeExpo,
        screenFilePreloader,
        setViewExpo,
        setViewScreen,
        setPrepared
      } = this.props;
      setViewExpo(activeExpo);
      const section = match.params.section;

      if (section === screenUrl.START || section === screenUrl.FINISH) {
        const viewScreen = activeExpo.structure[section];
        setViewScreen(viewScreen);
        await screenFilePreloader(viewScreen, section);
        setPrepared(true);
      }
    }
  })
)(({ match, location, preloadedFiles, prepared }) => {
  const section = match.params.section;

  if (prepared) {
    if (section === screenUrl.START)
      return <ViewStart {...{ screenFiles: preloadedFiles }} />;
    else if (section === screenUrl.FINISH) {
      return <ViewFinish {...{ screenFiles: preloadedFiles }} />;
    } else if (match.url === location.pathname) return <ViewError />;
  }

  return (
    <Route
      path={`${match.url}/:screen`}
      render={() => <ViewScreen {...{ section }} />}
    />
  );
});

export default compose(
  withRouter,
  connect(
    ({ expo: { activeExpo } }) => ({
      activeExpo
    }),
    { loadExpo, getCurrentUser }
  ),
  lifecycle({
    componentWillMount() {
      const { getCurrentUser } = this.props;
      getCurrentUser();
    },
    async componentDidMount() {
      const { match, loadExpo } = this.props;
      await loadExpo(match.params.id);
    }
  })
)(({ activeExpo, match }) => {
  if (!isEmpty(activeExpo)) {
    return (
      <ViewWrap
        title={activeExpo.title}
        institution={get(activeExpo, "organization")}
      >
        <Helmet>
          <title>{`INDIHU - ${activeExpo.title}`}</title>
          <meta name="description" content="Náhled obrazovky" />
        </Helmet>
        <Route path={`${match.url}/:section`} render={() => <ViewSection />} />
      </ViewWrap>
    );
  }
  return <div />;
});
