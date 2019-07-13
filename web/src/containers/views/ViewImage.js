import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { connect } from "react-redux";
import { map, get } from "lodash";

import InfopointIcon from "../../components/InfopointIcon";
import ScreenMenu from "../../components/views/ScreenMenu";
import { animationType } from "../../enums/animationType";
import { getFileById } from "../../actions/fileActions";
import { getObjectFitSize, getImageData } from "../../utils/viewer";

const ViewImage = ({ viewScreen, getFileById, imageBoundingClientRect }) => {
  const image = viewScreen.image ? getFileById(viewScreen.image) : null;

  const container = document.getElementById("view-image-image-container-inner")
    ? document
        .getElementById("view-image-image-container-inner")
        .getBoundingClientRect()
    : null;

  const imageData =
    container && imageBoundingClientRect
      ? getImageData(
          container.width,
          container.height,
          get(viewScreen, `imageOrigData.width`),
          get(viewScreen, `imageOrigData.height`),
          imageBoundingClientRect.width,
          imageBoundingClientRect.height
        )
      : null;

  return (
    <div>
      <div className="viewer-screen">
        {map(viewScreen.infopoints, (infopoint, i) => (
          <InfopointIcon
            key={i}
            className="infopoint-icon custom-tooltip hidden-custom-tooltip"
          >
            <div
              id={`view-image-image-infopoint-tooltip-hidden-${i}`}
              className="tooltip-text"
            >
              {infopoint.text}
            </div>
          </InfopointIcon>
        ))}
        <div
          id="view-image-image-container"
          className={classNames("image-screen", {
            "animation-imageSlideDown":
              viewScreen.animationType === animationType.FROM_TOP,
            "animation-imageSlideUp":
              viewScreen.animationType === animationType.FROM_BOTTOM,
            "animation-imageSlideRight":
              viewScreen.animationType === animationType.FROM_LEFT_TO_RIGHT,
            "animation-imageSlideLeft":
              viewScreen.animationType === animationType.FROM_RIGHT_TO_LEFT
          })}
          style={{
            animationDuration: `${
              viewScreen.time && viewScreen.time > 0 ? viewScreen.time : "20"
            }s`
          }}
        >
          <div
            id="view-image-image-container-inner"
            className="image-screen-inner view-image-image-container-inner"
          />
          {image &&
            viewScreen.image &&
            viewScreen.imageOrigData &&
            viewScreen.infopoints && (
              <div
                id="view-image-infopoints-container"
                className="view-image-infopoints-container"
              >
                {map(viewScreen.infopoints, (infopoint, i) => (
                  <InfopointIcon
                    key={i}
                    className={classNames("infopoint-icon custom-tooltip", {
                      show: infopoint.alwaysVisible
                    })}
                    style={{
                      position: "absolute",
                      top:
                        container &&
                        imageData &&
                        document.getElementById(
                          `view-image-image-infopoint-tooltip-hidden-${i}`
                        )
                          ? `calc(${imageData.top +
                              infopoint.top / imageData.ratio -
                              document
                                .getElementById(
                                  `view-image-image-infopoint-tooltip-hidden-${i}`
                                )
                                .getBoundingClientRect().height}px - 0.5em)`
                          : 0,
                      left:
                        container &&
                        imageData &&
                        document.getElementById(
                          `view-image-image-infopoint-tooltip-hidden-${i}`
                        )
                          ? imageData.left +
                            infopoint.left / imageData.ratio -
                            document
                              .getElementById(
                                `view-image-image-infopoint-tooltip-hidden-${i}`
                              )
                              .getBoundingClientRect().width /
                              2
                          : 0
                    }}
                  >
                    <div className="tooltip-text">{infopoint.text}</div>
                  </InfopointIcon>
                ))}
              </div>
            )}
        </div>
      </div>
      <ScreenMenu viewScreen={viewScreen} />
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({ expo: { viewScreen } }) => ({ viewScreen }),
    {
      getFileById
    }
  ),
  withState("intervalId", "setIntervalId", null),
  withState("imageBoundingClientRect", "setImageBoundingClientRect", null),
  withHandlers({
    updateImageBoundingClientRect: ({ setImageBoundingClientRect }) => () => {
      const img = document.getElementById("view-image-image");
      if (img) {
        setImageBoundingClientRect(
          getObjectFitSize(
            true,
            img.width,
            img.height,
            img.naturalWidth,
            img.naturalHeight
          )
        );
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const {
        viewScreen,
        screenFiles,
        updateImageBoundingClientRect,
        setIntervalId
      } = this.props;

      if (viewScreen.image) {
        const newNode = screenFiles["image"];

        newNode.id = "view-image-image";
        newNode.setAttribute(
          "style",
          viewScreen.animationType === animationType.FROM_LEFT_TO_RIGHT ||
            viewScreen.animationType === animationType.FROM_RIGHT_TO_LEFT
            ? "position: static; min-width: 120vw; width: 120vw; height: auto;"
            : viewScreen.animationType === animationType.FROM_TOP ||
              viewScreen.animationType === animationType.FROM_BOTTOM
            ? "position: static; min-height: 120vh; height: 120vh; width: auto;"
            : "position: static; max-width: 100%; max-height: 100%;"
        );
        document
          .getElementById("view-image-image-container-inner")
          .appendChild(newNode);

        setIntervalId(setInterval(updateImageBoundingClientRect, 30));
      }
    },
    componentWillUnmount() {
      const { intervalId } = this.props;

      clearInterval(intervalId);
    }
  })
)(ViewImage);
