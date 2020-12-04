import React from "react";
import { withRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import {
  compose,
  lifecycle,
  withState,
  withProps,
  withHandlers
} from "recompose";
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

import Progress from "../components/Progress";
import PlayExpo from "../components/views/PlayExpo";
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
        soundIsTurnedOff,
        viewChapterMusic,
        viewScreenAudio
      }
    }) => ({
      activeExpo,
      preloadedFiles,
      viewScreen,
      viewInteractive,
      soundIsTurnedOff,
      viewChapterMusic,
      viewScreenAudio
    }),
    { screenFilePreloader, setViewScreen, setChapterMusic, setScreenAudio }
  ),
  lifecycle({
    async componentWillMount() {
      const {
        match,
        section,
        activeExpo,
        screenFilePreloader,
        setViewScreen,
        setPrepared
      } = this.props;
      const screen = match.params.screen;
      const viewScreen = activeExpo.structure.screens[section][screen] || {};

      setViewScreen(viewScreen);
      await screenFilePreloader(viewScreen, section, screen);
      setPrepared(true);
    },
    componentWillReceiveProps({ viewInteractive, preloadedFiles, started }) {
      const {
        viewScreen,
        viewChapterMusic,
        viewScreenAudio,
        viewInteractive: oldViewInteractive,
        soundIsTurnedOff,
        setChapterMusic,
        setScreenAudio,
        started: oldStarted
      } = this.props;

      if (oldViewInteractive !== viewInteractive) {
        if (viewChapterMusic) {
          if (!viewInteractive) {
            viewChapterMusic.play();
          } else {
            viewChapterMusic.pause();
          }
        }

        if (viewScreenAudio) {
          if (!viewInteractive) {
            viewScreenAudio.currentTime = 0;
            viewScreenAudio.play();
          } else {
            viewScreenAudio.pause();
          }
        }
      }

      if (started && !oldStarted) {
        /** chapter music */
        if (preloadedFiles.music) {
          const music = preloadedFiles.music;
          music.loop = true;
          music.volume =
            viewScreen.muteChapterMusic || soundIsTurnedOff ? 0 : 0.2;
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
    }
  }),
  withProps(({ viewExpo }) => ({
    allFilesLoaded:
      viewExpo &&
      (!viewExpo.filesTotal ||
        (viewExpo.filesTotal &&
          viewExpo.filesLoaded &&
          viewExpo.filesLoaded >= viewExpo.filesTotal))
  }))
)(
  ({
    prepared,
    preloadedFiles,
    viewInteractive,
    viewExpo,
    allFilesLoaded,
    started,
    setStarted
  }) => {
    if (!prepared || !allFilesLoaded) {
      return (
        <Progress
          {...{
            percent: viewExpo
              ? viewExpo.filesLoaded
                ? (viewExpo.filesLoaded / viewExpo.filesTotal) * 100 < 100
                  ? (viewExpo.filesLoaded / viewExpo.filesTotal) * 100
                  : 100
                : 0
              : undefined,
            text: viewExpo ? "Obrazovka se načítá" : "Obrazovka se připravuje"
          }}
        />
      );
    }

    if (!started) {
      return (
        <PlayExpo onClick={() => setStarted(true)} text="Spustit obrazovku" />
      );
    }

    if (viewInteractive)
      return (
        <InteractiveScreen
          {...{ screenViewer: true, screenFiles: preloadedFiles }}
        />
      );

    return <Viewers sFiles={preloadedFiles} />;
  }
);

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
  }),
  withProps(({ viewExpo }) => ({
    allFilesLoaded:
      viewExpo &&
      (!viewExpo.filesTotal ||
        (viewExpo.filesTotal &&
          viewExpo.filesLoaded &&
          viewExpo.filesLoaded >= viewExpo.filesTotal))
  }))
)(
  ({
    match,
    location,
    preloadedFiles,
    prepared,
    viewExpo,
    allFilesLoaded,
    started,
    setStarted
  }) => {
    const section = match.params.section;

    if (prepared) {
      if (!allFilesLoaded) {
        return (
          <Progress
            {...{
              percent: viewExpo.filesLoaded
                ? (viewExpo.filesLoaded / viewExpo.filesTotal) * 100 < 100
                  ? (viewExpo.filesLoaded / viewExpo.filesTotal) * 100
                  : 100
                : 0,
              text: "Obrazovka se načítá"
            }}
          />
        );
      }

      if (section === screenUrl.START)
        return <ViewStart {...{ screenFiles: preloadedFiles }} />;
      else if (section === screenUrl.FINISH) {
        return <ViewFinish {...{ screenFiles: preloadedFiles }} />;
      } else if (match.url === location.pathname) return <ViewError />;
    }

    return (
      <Route
        path={`${match.url}/:screen`}
        render={() => (
          <ViewScreen {...{ viewExpo, section, started, setStarted }} />
        )}
      />
    );
  }
);

export default compose(
  withRouter,
  withState("started", "setStarted", false),
  connect(
    ({
      expo: {
        activeExpo,
        viewChapterMusic,
        viewScreenAudio,
        viewInteractive,
        viewExpo
      }
    }) => ({
      activeExpo,
      viewChapterMusic,
      viewScreenAudio,
      viewInteractive,
      viewExpo
    }),
    { loadExpo, getCurrentUser, turnSoundOff, setChapterMusic, setScreenAudio }
  ),
  withHandlers({
    enterListener: ({ started, setStarted }) => e => {
      if (!started && e.key === "Enter") {
        setStarted(true);
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      const { getCurrentUser, enterListener } = this.props;

      document.addEventListener("keydown", enterListener);

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
        setScreenAudio,
        enterListener
      } = this.props;

      document.removeEventListener("keydown", enterListener);

      turnSoundOff(false);

      if (viewChapterMusic) {
        viewChapterMusic.pause();
        viewChapterMusic.currentTime = 0;
      }

      if (viewScreenAudio) {
        viewScreenAudio.pause();
        viewScreenAudio.currentTime = 0;
      }

      setChapterMusic(null);
      setScreenAudio(null);
    }
  })
)(({ activeExpo, viewExpo, match, viewInteractive, started, setStarted }) => {
  if (!isEmpty(activeExpo)) {
    return (
      <ViewWrap
        title={activeExpo.title}
        organization={get(activeExpo, "organization")}
        organizationLink={get(activeExpo, "structure.start.organizationLink")}
        viewInteractive={viewInteractive}
        progressEnabled={viewExpo && started}
      >
        <Helmet>
          <title>{`INDIHU Exhibition${
            get(activeExpo, "title") ? ` - ${get(activeExpo, "title")}` : ""
          }`}</title>
          <meta name="description" content="Náhled obrazovky" />
        </Helmet>
        <Route
          path={`${match.url}/:section`}
          render={() => (
            <ViewSection
              viewExpo={viewExpo}
              started={started}
              setStarted={setStarted}
            />
          )}
        />
      </ViewWrap>
    );
  }
  return <div />;
});
