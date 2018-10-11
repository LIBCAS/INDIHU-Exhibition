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
  setViewScreen,
  turnSoundOff,
  setChapterMusic,
  setScreenAudio
} from "../actions/expoActions/viewerActions";
import { screenUrl } from "../enums/screenType";

import ViewWrap from "../components/views/ViewWrap";
import ViewStart from "./views/ViewStart";
import ViewFinish from "./views/ViewFinish";
import ViewError from "./views/ViewError";
import Viewers from "./views";
import InteractiveScreen from "./views/InteractiveScreen";

const ViewScreen = compose(
  withRouter,
  withState("prepared", "setPrepared", false),
  connect(
    ({
      expo: {
        activeExpo,
        preloadedFiles,
        viewScreen,
        viewInteractive,
        soundIsTurnedOff
      }
    }) => ({
      activeExpo,
      preloadedFiles,
      viewScreen,
      viewInteractive,
      soundIsTurnedOff
    }),
    { screenFilePreloader, setViewScreen, setChapterMusic, setScreenAudio }
  ),
  lifecycle({
    async componentWillMount() {
      const {
        match,
        section,
        activeExpo,
        setChapterMusic,
        setScreenAudio,
        screenFilePreloader,
        setViewScreen,
        setPrepared,
        soundIsTurnedOff
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
        music.volume = soundIsTurnedOff ? 0 : 0.2;
        music.play();
        setChapterMusic(music);
      } else {
        setChapterMusic(null);
      }

      /** screen audio */
      if (preloadedFiles.audio) {
        const audio = preloadedFiles.audio;
        audio.currentTime = 0;
        audio.volume = soundIsTurnedOff ? 0 : 1;
        audio.play();
        setScreenAudio(audio);
      } else {
        setScreenAudio(null);
      }
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
    ({ expo: { activeExpo, viewChapterMusic, viewScreenAudio } }) => ({
      activeExpo,
      viewChapterMusic,
      viewScreenAudio
    }),
    { loadExpo, getCurrentUser, turnSoundOff, setChapterMusic, setScreenAudio }
  ),
  lifecycle({
    componentWillMount() {
      const { getCurrentUser } = this.props;
      getCurrentUser();
    },
    async componentDidMount() {
      const { match, loadExpo } = this.props;
      await loadExpo(match.params.id);
    },
    componentWillUnmount() {
      const {
        turnSoundOff,
        viewChapterMusic,
        viewScreenAudio,
        setChapterMusic,
        setScreenAudio
      } = this.props;

      turnSoundOff(false);

      if (viewChapterMusic) viewChapterMusic.pause();

      if (viewScreenAudio) viewScreenAudio.pause();

      setChapterMusic(null);
      setScreenAudio(null);
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
