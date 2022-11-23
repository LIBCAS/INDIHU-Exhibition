import { connect } from "react-redux";
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from "recompose";
import { withRouter } from "react-router-dom";
import { get, map, filter, isEqual } from "lodash";
import { matchPath } from "react-router-dom";

import { setDialog } from "../../actions/dialog-actions";
import {
  turnSoundOff,
  prepareReturnToViewStart,
  setViewProgress,
  tickProgress,
} from "../../actions/expoActions/viewer-actions";
import { screenType } from "../../enums/screen-type";
import { tickTime } from "constants/view-screen-progress";

const ViewWrap = ({ children }) => (
  <div className="h-full w-full bg-background -z-50">{children}</div>
);

export default compose(
  withRouter,
  connect(
    ({
      expo: {
        viewExpo,
        viewScreen,
        soundIsTurnedOff,
        preloadedFiles,
        viewChapterMusic,
        viewProgress,
      },
    }) => ({
      viewExpo,
      viewScreen,
      soundIsTurnedOff,
      preloadedFiles,
      viewChapterMusic,
      viewProgress,
    }),
    {
      setDialog,
      turnSoundOff,
      prepareReturnToViewStart,
      setViewProgress,
      tickProgress,
    }
  ),
  withState("url", "setUrl", null),
  withState("viewScreenState", "setViewScreenState", null),
  withState("progressIntervalId", "setProgressIntervalId", null),
  withProps(({ viewExpo, viewProgress, location }) => {
    const match = matchPath(location.pathname, {
      path: "/view/:id/:section/:screen",
    });
    const screen = match ? match.params.screen : 0;
    const section = match ? match.params.section : 0;
    const screens = get(viewExpo, "structure.screens") || [];
    const totalFromPreviousSections = screens.reduce(
      (acc, chapter, index) => (index < section ? acc + chapter.length : acc),
      0
    );
    const screenNumber = totalFromPreviousSections + Number(screen) + 1;
    const totalScreens = screens.reduce(
      (total, chapter) => total + chapter.length,
      0
    );

    const progressPercentage =
      (viewProgress.timeElapsed * 100) / viewProgress.totalTime;

    const chapters = filter(
      map(get(viewExpo, "structure.screens", []), (screens, i) => ({
        chapter: get(screens, "[0]"),
        chapterNumber: i,
      })),
      (item) => get(item, "chapter.type") === "INTRO"
    );

    return {
      screenNumber,
      totalScreens,
      chapters,
      progressPercentage,
    };
  }),
  withHandlers({
    shouldShowScreenProgression:
      ({ viewScreen }) =>
      () =>
        viewScreen &&
        viewScreen.type !== screenType.FINISH &&
        viewScreen.type !== screenType.START,
    shouldShowProgress:
      ({ viewInteractive, viewScreen, expoViewer, preloadedFiles }) =>
      () =>
        !viewInteractive &&
        viewScreen &&
        viewScreen.type !== screenType.START &&
        viewScreen.type !== screenType.FINISH &&
        viewScreen.type !== screenType.GAME_DRAW &&
        viewScreen.type !== screenType.GAME_FIND &&
        viewScreen.type !== screenType.GAME_MOVE &&
        viewScreen.type !== screenType.GAME_OPTIONS &&
        viewScreen.type !== screenType.GAME_SIZING &&
        viewScreen.type !== screenType.GAME_WIPE &&
        (expoViewer ||
          viewScreen.type !== screenType.VIDEO ||
          !isNaN(get(preloadedFiles, `video.duration`))),
    showVolumeIcon:
      ({ viewScreen, viewChapterMusic }) =>
      () =>
        viewScreen &&
        viewScreen.type !== screenType.START &&
        viewScreen.type !== screenType.FINISH &&
        viewScreen.type !== screenType.GAME_DRAW &&
        viewScreen.type !== screenType.GAME_FIND &&
        viewScreen.type !== screenType.GAME_MOVE &&
        viewScreen.type !== screenType.GAME_OPTIONS &&
        viewScreen.type !== screenType.GAME_SIZING &&
        viewScreen.type !== screenType.GAME_WIPE &&
        viewScreen.type !== screenType.START &&
        viewScreen.type !== screenType.FINISH &&
        (viewScreen.audio || viewChapterMusic),
  }),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { tickProgress, setProgressIntervalId } = this.props;

      const intervalId = setInterval(() => tickProgress(), tickTime);
      setProgressIntervalId(intervalId);
    },
    UNSAFE_componentWillReceiveProps(nextProps) {
      const {
        viewScreen,
        viewScreenState,
        url,
        viewInteractive,
        location,
        progressEnabled,
        tickProgress,
      } = nextProps;
      const {
        setUrl,
        setViewProgress,
        progressIntervalId,
        setProgressIntervalId,
        viewScreen: oldViewScreen,
        viewInteractive: oldViewInteractive,
        shouldShowProgress,
        setViewScreenState,
        progressEnabled: oldProgressEnabled,
      } = this.props;

      if (
        get(oldViewScreen, "type") !== get(viewScreen, "type") ||
        oldViewInteractive !== viewInteractive ||
        oldProgressEnabled !== progressEnabled
      ) {
        const showProgressBar = shouldShowProgress();
        setViewProgress({ showProgressBar });
      }

      if (oldViewInteractive !== viewInteractive) {
        if (viewInteractive) {
          clearInterval(progressIntervalId);
        } else {
          const intervalId = setInterval(() => tickProgress(), tickTime);
          setProgressIntervalId(intervalId);
        }
      }

      if (
        viewScreen &&
        ((get(viewScreen, "id") &&
          get(viewScreenState, "id") !== get(viewScreen, "id")) ||
          !isEqual(viewScreen, viewScreenState) ||
          !viewScreenState) &&
        url !== location.pathname
      ) {
        setViewScreenState(viewScreen);
        setUrl(location.pathname);
        setViewProgress({
          timeElapsed: 0,
          totalTime: get(viewScreen, "time", 20) * 1000,
          showProgressBar: shouldShowProgress(),
        });
      }
    },
    componentWillUnmount() {
      clearInterval(this.props.progressIntervalId);
    },
  })
)(ViewWrap);
