import React from "react";
import { connect } from "react-redux";
import { compose, withState, lifecycle, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";

import ScreenMenu from "../../components/views/ScreenMenu";

const ViewVideo = ({ viewScreen }) => {
  return (
    <div>
      <div
        className="viewer-screen viewer-video-container"
        id="view-video-container"
      />
      <ScreenMenu {...{ viewScreen }} />
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null),
  withState("videoCheckInterval", "setVideoCheckInterval", null),
  withState("timeout", "setStateTimeout", null),
  withState("videoStarted", "setVideoStarted", false),
  withHandlers({
    timer: ({
      videoStarted,
      setVideoStarted,
      setStateTimeout,
      history,
      getNextUrlPart
    }) => () => {
      if (
        !videoStarted &&
        document.getElementById("view-video-video") &&
        document.getElementById("view-video-video").readyState === 4
      ) {
        setVideoStarted(true);
        if (getNextUrlPart) {
          setStateTimeout(
            setTimeout(
              () => history.push(getNextUrlPart()),
              document.getElementById("view-video-video").duration * 1000
            )
          );
        }
        document.getElementById("view-video-video").play();
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const {
        timer,
        setVideoCheckInterval,
        setStateTimeout,
        history,
        getNextUrlPart,
        screenFiles
      } = this.props;

      if (screenFiles["video"]) {
        const video = screenFiles["video"];
        video.id = "view-video-video";
        video.controls = "";
        video.currentTime = 0;
        document.getElementById("view-video-container").appendChild(video);
        setVideoCheckInterval(setInterval(timer, 100));
      } else {
        if (getNextUrlPart) {
          setStateTimeout(
            setTimeout(() => history.push(getNextUrlPart()), 20000)
          );
        }
      }
    },
    componentWillUnmount() {
      const { videoCheckInterval, timeout } = this.props;

      clearInterval(videoCheckInterval);
      clearTimeout(timeout);
    }
  })
)(ViewVideo);
