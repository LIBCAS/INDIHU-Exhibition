import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { compose, lifecycle, withState } from "recompose";
import { connect } from "react-redux";
import { map } from "lodash";
import FontIcon from "react-md/lib/FontIcons";

import ScreenMenu from "../../components/views/ScreenMenu";
import { animationType } from "../../enums/animationType";
import { getFileById } from "../../actions/fileActions";

const ViewImage = ({ viewScreen, getFileById, state }) => {
  const image = viewScreen.image ? getFileById(viewScreen.image) : null;

  const container = document.getElementById("view-image-image-container")
    ? document
      .getElementById("view-image-image-container")
      .getBoundingClientRect()
    : null;

  return (
    <div>
      <div className="viewer-screen">
        <div
          id="view-image-image-container"
          className={classNames("image-screen", {
            "animation-imageSlideDown":
              viewScreen.animationType === animationType.FROM_TOP,
            "animation-imageSlideUp":
              viewScreen.animationType === animationType.FROM_BOTTOM
          })}
          style={{
            animationDuration: `${viewScreen.time && viewScreen.time > 0
              ? viewScreen.time
              : "20"}s`
          }}
        >
          <div
            id="view-image-image-container-inner"
            className="image-screen-inner"
          />
          {image &&
            viewScreen.image &&
            viewScreen.imageOrigData &&
            viewScreen.infopoints &&
            map(viewScreen.infopoints, (infopoint, i) =>
              <FontIcon
                key={i}
                className={classNames("infopoint-icon custom-tooltip", { "show": infopoint.alwaysVisible })}
                style={{
                  position: "absolute",
                  top: container
                    ? viewScreen.imageOrigData.height >
                      viewScreen.imageOrigData.width
                      ? container.height /
                      viewScreen.imageOrigData.height *
                      infopoint.top -
                      12
                      : container.height / 2 -
                      viewScreen.imageOrigData.height *
                      (container.width / viewScreen.imageOrigData.width) /
                      2 +
                      container.width /
                      viewScreen.imageOrigData.width *
                      infopoint.top -
                      12
                    : 0,
                  left: container
                    ? viewScreen.imageOrigData.width >
                      viewScreen.imageOrigData.height
                      ? container.width /
                      viewScreen.imageOrigData.width *
                      infopoint.left -
                      12
                      : container.width / 2 -
                      viewScreen.imageOrigData.width *
                      (container.height /
                        viewScreen.imageOrigData.height) /
                      2 +
                      container.height /
                      viewScreen.imageOrigData.height *
                      infopoint.left -
                      12
                    : 0
                }}
              >
                <div className="tooltip-text">{infopoint.text}</div>
                help_outline
              </FontIcon>
            )}
        </div>
      </div>
      <ScreenMenu viewScreen={viewScreen} />
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), {
    getFileById
  }),
  withState("state", "setState", false), // pro vykreslení infopointů
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles, setState } = this.props;

      if (viewScreen.image) {
        const newNode = screenFiles["image"];

        const container = document
          .getElementById("view-image-image-container-inner")
          .getBoundingClientRect();

        newNode.id = "view-image-image";
        newNode.setAttribute(
          "style",
          `top: ${viewScreen.imageOrigData.height >
            viewScreen.imageOrigData.width
            ? 0
            : container.height / 2 -
            viewScreen.imageOrigData.height *
            (container.width / viewScreen.imageOrigData.width) /
            2}px; left: ${viewScreen.imageOrigData.width >
              viewScreen.imageOrigData.height
              ? 0
              : container.width / 2 -
              viewScreen.imageOrigData.width *
              (container.height / viewScreen.imageOrigData.height) /
              2}px; width: ${viewScreen.imageOrigData.height >
                viewScreen.imageOrigData.width
                ? "auto"
                : "100%"}; height: ${viewScreen.imageOrigData.height >
                  viewScreen.imageOrigData.width
                  ? "100%"
                  : "auto"};`
        );
        document
          .getElementById("view-image-image-container-inner")
          .prepend(newNode);

        setState(true);
      }
    }
  })
)(ViewImage);
