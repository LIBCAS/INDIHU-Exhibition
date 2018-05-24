import React from "react";
import { compose, lifecycle } from "recompose";

const Video = () => {
  return (
    <div
      id="interactive-screen-video-container"
      className="viewer-video-container interactive"
    />
  );
};

export default compose(
  lifecycle({
    componentDidMount() {
      const { screenFiles } = this.props;

      if (screenFiles["video"]) {
        const video = screenFiles["video"];
        video.controls = "true";
        video.currentTime = 0;
        document
          .getElementById("interactive-screen-video-container")
          .appendChild(video);
      }
    }
  })
)(Video);
