import { compose, lifecycle, withState } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import {
  setViewProgress,
  tickProgress,
} from "../../actions/expoActions/viewer-actions";
import { setDialog } from "../../actions/dialog-actions";

import { get, isEqual } from "lodash";
import { isGameScreen } from "utils/view-utils";

import { tickTime } from "constants/view-screen-progress";

const ViewWrap = ({ children }) => {
  const { expoDesignData } = useExpoDesignData();

  return (
    <div
      className="h-full w-full bg-background -z-50"
      style={{ backgroundColor: expoDesignData?.backgroundColor }}
    >
      {children}
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({ expo: { viewExpo, viewScreen, viewProgress } }) => ({
      viewExpo,
      viewScreen,
      viewProgress,
    }),
    {
      setDialog,
      setViewProgress,
      tickProgress,
    }
  ),
  withState("url", "setUrl", null),
  withState("viewScreenState", "setViewScreenState", null),
  withState("progressIntervalId", "setProgressIntervalId", null),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { tickProgress, setProgressIntervalId } = this.props;

      const intervalId = setInterval(() => tickProgress(), tickTime);
      setProgressIntervalId(intervalId);
    },
    UNSAFE_componentWillReceiveProps(nextProps) {
      const { viewScreen, viewScreenState, url, location } = nextProps;
      const { setUrl, setViewProgress, setViewScreenState } = this.props;

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
        });
      }
    },
    componentWillUnmount() {
      clearInterval(this.props.progressIntervalId);
    },
  })
)(ViewWrap);
