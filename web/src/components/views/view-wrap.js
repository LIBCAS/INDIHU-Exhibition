import { compose, lifecycle, withState, withHandlers } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  turnSoundOff,
  setViewProgress,
  tickProgress,
} from "../../actions/expoActions/viewer-actions";
import { setDialog } from "../../actions/dialog-actions";

import { get, isEqual } from "lodash";
import { isGameScreen } from "containers/views/utils";

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
      setViewProgress,
      tickProgress,
    }
  ),
  withState("url", "setUrl", null),
  withState("viewScreenState", "setViewScreenState", null),
  withState("progressIntervalId", "setProgressIntervalId", null),
  withHandlers({
    // Returns True if current store.expo.viewScreen is not START | FINISH | GAME screen
    shouldShowProgress:
      ({ viewInteractive, viewScreen, expoViewer, preloadedFiles }) =>
      () =>
        !viewInteractive && // viewInteractive is always false in redux store currently
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
        // tickProgress,
      } = nextProps;
      const {
        setUrl,
        setViewProgress,
        // progressIntervalId,
        // setProgressIntervalId,
        viewScreen: oldViewScreen,
        viewInteractive: oldViewInteractive,
        shouldShowProgress,
        setViewScreenState,
        progressEnabled: oldProgressEnabled,
      } = this.props;

      // Everytime a screen.type is changed!
      if (
        get(oldViewScreen, "type") !== get(viewScreen, "type") ||
        oldViewInteractive !== viewInteractive ||
        oldProgressEnabled !== progressEnabled
      ) {
        const showProgressBar = shouldShowProgress();
        setViewProgress({ showProgressBar });
      }

      // viewInteractive is always false.. this condition is never called!
      /*
      if (oldViewInteractive !== viewInteractive) {
        if (viewInteractive) {
          clearInterval(progressIntervalId);
        } else {
          const intervalId = setInterval(() => tickProgress(), tickTime);
          setProgressIntervalId(intervalId);
        }
      }
      */

      /* Called everytime a viewScreen is switched to the next or previous one */
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
          // TODO - hardcoded 15s for game screens, in future, maybe value from administration
          totalTime: isGameScreen(viewScreen.type)
            ? 15000
            : get(viewScreen, "time", 20) * 1000,
          // store.expo.viewProgress.showProgressBar -- not used from redux.. custom logic in Views
          showProgressBar: shouldShowProgress(),
        });
      }
    },
    componentWillUnmount() {
      clearInterval(this.props.progressIntervalId);
    },
  })
)(ViewWrap);
