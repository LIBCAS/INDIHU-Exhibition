import React from "react";
import { map, isEmpty } from "lodash";
import { compose, lifecycle, withState } from "recompose";
import classNames from "classnames";

import { animationType } from "../../../enums/animationType";
import InfopointIcon from "../../InfopointIcon";

const Image = ({
  viewScreen,
  activeImageIndex,
  animationActive,
  actScale,
  screenType
}) => {
  return (
    <div
      id="interactive-screen-image-container"
      className="interactive-screen-image-container"
    >
      {map(
        viewScreen.infopoints
          ? viewScreen.infopoints
          : viewScreen.sequences
          ? viewScreen.sequences
          : viewScreen.images[activeImageIndex].infopoints,
        (item, i) => (
          <InfopointIcon
            key={i}
            className="infopoint-icon custom-tooltip hidden-custom-tooltip"
          >
            <div
              id={`inveractive-image-infopoint-tooltip-hidden-${i}`}
              className="tooltip-text"
            >
              {item.text}
            </div>
          </InfopointIcon>
        )
      )}
      <div
        id="interactive-screen-image-container-inner"
        className="interactive-screen-image-container-inner"
      />
      {((viewScreen.image &&
        viewScreen.imageOrigData &&
        (viewScreen.infopoints || viewScreen.sequences)) ||
        viewScreen.images) &&
        document.getElementById("interactive-screen-image-container") &&
        document.getElementById("interactive-screen-image") &&
        !animationActive &&
        map(
          viewScreen.infopoints
            ? viewScreen.infopoints
            : viewScreen.sequences
            ? viewScreen.sequences
            : viewScreen.images[activeImageIndex].infopoints,
          (item, i) => (
            <div className="image-screen-infopoint" key={i}>
              <InfopointIcon
                className={classNames("infopoint-icon custom-tooltip", {
                  show: item.alwaysVisible
                })}
                style={
                  viewScreen.type === screenType.IMAGE_ZOOM
                    ? {
                        position: "absolute",
                        top: document.getElementById(
                          `inveractive-image-infopoint-tooltip-hidden-${i}`
                        )
                          ? actScale === 1
                            ? (document
                                .getElementById(
                                  "interactive-screen-image-container"
                                )
                                .getBoundingClientRect().height -
                                viewScreen.imageOrigData.height) /
                                2 +
                              item.top -
                              17 -
                              document
                                .getElementById(
                                  `inveractive-image-infopoint-tooltip-hidden-${i}`
                                )
                                .getBoundingClientRect().height
                            : document
                                .getElementById(
                                  "interactive-screen-image-container"
                                )
                                .getBoundingClientRect().height /
                                2 -
                              17 -
                              document
                                .getElementById(
                                  `inveractive-image-infopoint-tooltip-hidden-${i}`
                                )
                                .getBoundingClientRect().height
                          : 0,
                        left: document.getElementById(
                          `inveractive-image-infopoint-tooltip-hidden-${i}`
                        )
                          ? actScale === 1
                            ? (document
                                .getElementById(
                                  "interactive-screen-image-container"
                                )
                                .getBoundingClientRect().width -
                                viewScreen.imageOrigData.width) /
                                2 +
                              item.left -
                              17 -
                              document
                                .getElementById(
                                  `inveractive-image-infopoint-tooltip-hidden-${i}`
                                )
                                .getBoundingClientRect().width /
                                2
                            : document
                                .getElementById(
                                  "interactive-screen-image-container"
                                )
                                .getBoundingClientRect().width /
                                2 -
                              17 -
                              document
                                .getElementById(
                                  `inveractive-image-infopoint-tooltip-hidden-${i}`
                                )
                                .getBoundingClientRect().width /
                                2
                          : 0
                      }
                    : {
                        position: "absolute",
                        top:
                          document
                            .getElementById("interactive-screen-image")
                            .getBoundingClientRect().top -
                          document
                            .getElementById(
                              "interactive-screen-image-container"
                            )
                            .getBoundingClientRect().top +
                          item.top *
                            (document
                              .getElementById("interactive-screen-image")
                              .getBoundingClientRect().height /
                              (viewScreen.image
                                ? viewScreen.imageOrigData.height
                                : viewScreen.images[activeImageIndex]
                                    .imageOrigData.height)) -
                          17 -
                          document
                            .getElementById(
                              `inveractive-image-infopoint-tooltip-hidden-${i}`
                            )
                            .getBoundingClientRect().height,
                        left:
                          (document
                            .getElementById(
                              "interactive-screen-image-container"
                            )
                            .getBoundingClientRect().width -
                            (document
                              .getElementById("interactive-screen-image")
                              .getBoundingClientRect().height /
                              (viewScreen.image
                                ? viewScreen.imageOrigData.height
                                : viewScreen.images[activeImageIndex]
                                    .imageOrigData.height)) *
                              (viewScreen.image
                                ? viewScreen.imageOrigData.width
                                : viewScreen.images[activeImageIndex]
                                    .imageOrigData.width)) /
                            2 +
                          item.left *
                            (document
                              .getElementById("interactive-screen-image")
                              .getBoundingClientRect().height /
                              (viewScreen.image
                                ? viewScreen.imageOrigData.height
                                : viewScreen.images[activeImageIndex]
                                    .imageOrigData.height)) -
                          17 -
                          document
                            .getElementById(
                              `inveractive-image-infopoint-tooltip-hidden-${i}`
                            )
                            .getBoundingClientRect().width /
                            2
                      }
                }
              >
                <div className="tooltip-text">{item.text}</div>
              </InfopointIcon>
            </div>
          )
        )}
    </div>
  );
};

export default compose(
  withState("origPosition", "setOrigPos", [0, 0]),
  withState("actPosition", "setActPos", [0, 0]),
  withState("actScale", "setScale", 1),
  withState("activeSeqIndex", "setActiveSeqIndex", 0),
  withState("transformTime", "setTransformTime", 0),
  withState("activeImageIndex", "setActiveImageIndex", 0),
  withState("animationState", "setAnimationState", animationType.WITHOUT),
  lifecycle({
    componentDidMount() {
      const {
        viewScreen,
        screenFiles,
        setOrigPos,
        setActPos,
        screenType
      } = this.props;

      if (
        viewScreen.type === screenType.IMAGE &&
        viewScreen.image &&
        screenFiles["image"]
      ) {
        const newNode = screenFiles["image"];

        newNode.id = "interactive-screen-image";
        newNode.className = "";
        newNode.setAttribute(
          "style",
          `width: ${
            viewScreen.imageOrigData.height > viewScreen.imageOrigData.width
              ? "auto"
              : "100%"
          }; height: ${
            viewScreen.imageOrigData.height > viewScreen.imageOrigData.width
              ? "100%"
              : "auto"
          }`
        );

        document
          .getElementById("interactive-screen-image-container-inner")
          .appendChild(newNode);
      } else if (
        viewScreen.type === screenType.IMAGE_ZOOM &&
        viewScreen.imageOrigData &&
        !isEmpty(viewScreen.sequences) &&
        screenFiles["image"]
      ) {
        /** ZOOM IN */
        const defX = viewScreen.imageOrigData.width / 2;
        const defY = viewScreen.imageOrigData.height / 2;
        setOrigPos([defX, defY]);
        setActPos([-defX, -defY]);

        const newNode = screenFiles["image"];

        newNode.id = "interactive-screen-image";
        newNode.className = "";
        newNode.setAttribute(
          "style",
          `transition: transform 0s; transform: translate(${-defX}px, ${-defY}px) scale(1)`
        );

        document
          .getElementById("interactive-screen-image-container-inner")
          .appendChild(newNode);
      }
    }
  })
)(Image);
