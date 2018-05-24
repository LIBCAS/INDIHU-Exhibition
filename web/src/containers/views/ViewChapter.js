import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { compose, lifecycle } from "recompose";
import { connect } from "react-redux";

import { animationType } from "../../enums/animationType";

const ViewChapter = ({ viewScreen, getFileById }) => {
  return (
    <div className="viewer-screen">
      <div
        id="view-chapter-image-container"
        className="image-fullscreen-wrap"
      />
      <p className="title-fullscreen animation-typing">
        {viewScreen.title}
      </p>
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null),
  lifecycle({
    componentDidMount() {
      const { screenFiles, viewScreen } = this.props;

      if (screenFiles["image"]) {
        const newNode = screenFiles["image"];

        newNode.className = classNames("image-fullscreen", {
          "animation-slideDown":
            viewScreen.animationType &&
            viewScreen.animationType === animationType.FROM_TOP,
          "animation-slideUp":
            viewScreen.animationType &&
            viewScreen.animationType === animationType.FROM_BOTTOM
        });
        newNode.setAttribute(
          "style",
          `animation-duration: ${viewScreen.time && viewScreen.time > 0
            ? viewScreen.time
            : "20"}s`
        );
        document
          .getElementById("view-chapter-image-container")
          .appendChild(newNode);
      }
    }
  })
)(ViewChapter);
