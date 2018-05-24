import React from "react";
import { map, isEmpty } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import ReactTooltip from "react-tooltip";
import { compose, lifecycle, withState } from "recompose";

import { animationType } from "../../../enums/animationType";

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
          (item, i) =>
            <div className="image-screen-infopoint" key={i}>
              <FontIcon
                className="infopoint-icon"
                style={
                  viewScreen.type === screenType.IMAGE_ZOOM
                    ? {
                        position: "absolute",
                        top:
                          actScale === 1
                            ? (document
                                .getElementById(
                                  "interactive-screen-image-container"
                                )
                                .getBoundingClientRect().height -
                                viewScreen.imageOrigData.height) /
                                2 +
                              item.top -
                              12
                            : document
                                .getElementById(
                                  "interactive-screen-image-container"
                                )
                                .getBoundingClientRect().height /
                                2 -
                              12,
                        left:
                          actScale === 1
                            ? (document
                                .getElementById(
                                  "interactive-screen-image-container"
                                )
                                .getBoundingClientRect().width -
                                viewScreen.imageOrigData.width) /
                                2 +
                              item.left -
                              12
                            : document
                                .getElementById(
                                  "interactive-screen-image-container"
                                )
                                .getBoundingClientRect().width /
                                2 -
                              12
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
                          12,
                        left:
                          (document
                            .getElementById(
                              "interactive-screen-image-container"
                            )
                            .getBoundingClientRect().width -
                            document
                              .getElementById("interactive-screen-image")
                              .getBoundingClientRect().height /
                              (viewScreen.image
                                ? viewScreen.imageOrigData.height
                                : viewScreen.images[activeImageIndex]
                                    .imageOrigData.height) *
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
                          12
                      }
                }
                data-tip={item.text}
              >
                help_outline
              </FontIcon>
              <ReactTooltip
                className="infopoint-tooltip"
                type="dark"
                effect="solid"
              />
            </div>
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
          `width: ${viewScreen.imageOrigData.height >
          viewScreen.imageOrigData.width
            ? "auto"
            : "100%"}; height: ${viewScreen.imageOrigData.height >
          viewScreen.imageOrigData.width
            ? "100%"
            : "auto"}`
        );

        document
          .getElementById("interactive-screen-image-container-inner")
          .prepend(newNode);
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
          .prepend(newNode);
      }
    }
  })
)(Image);
