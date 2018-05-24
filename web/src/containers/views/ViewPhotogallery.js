import React from "react";
import { withRouter } from "react-router-dom";
import { compose, lifecycle, withState } from "recompose";
import { connect } from "react-redux";
import { isEmpty, get, map, forEach } from "lodash";
import classNames from "classnames";
import FontIcon from "react-md/lib/FontIcons";

import ScreenMenu from "../../components/views/ScreenMenu";
import { getFileById } from "../../actions/fileActions";

import { animationType } from "../../enums/animationType";

const ViewPhotogallery = ({
  viewScreen,
  getFileById,
  activeImageIndex,
  onImageLoad,
  animationTypeState
}) => {
  const container = document.getElementById("view-photogallery-image-container")
    ? document
        .getElementById("view-photogallery-image-container")
        .getBoundingClientRect()
    : null;

  const image = document.getElementById("view-photogallery-image")
    ? document.getElementById("view-photogallery-image").getBoundingClientRect()
    : null;

  if (
    document.getElementById(
      "view-photogallery-image-infopoint-tooltip-hidden-0"
    ) &&
    document
      .getElementById("view-photogallery-image-infopoint-tooltip-hidden-0")
      .getBoundingClientRect().width
  ) {
  }

  return (
    <div>
      <div className="viewer-screen">
        {map(
          get(viewScreen, `images[${activeImageIndex}].infopoints`),
          (infopoint, i) =>
            <FontIcon
              key={i}
              id={`view-photogallery-image-infopoint-hidden-${i}`}
              className={classNames(
                "infopoint-icon custom-tooltip hidden-custom-tooltip",
                {
                  show: infopoint.alwaysVisible
                }
              )}
            >
              <div
                id={`view-photogallery-image-infopoint-tooltip-hidden-${i}`}
                className="tooltip-text"
              >
                {infopoint.text}
              </div>
              help_outline
            </FontIcon>
        )}
        {viewScreen.images &&
          <div
            id="view-photogallery-image-container"
            className={classNames("image-screen", {
              "animation-fade-in": animationTypeState === animationType.FADE_IN,
              "animation-fade-out":
                animationTypeState === animationType.FADE_OUT,
              "animation-fly-in": animationTypeState === animationType.FLY_IN,
              "animation-fly-out": animationTypeState === animationType.FLY_OUT
            })}
          >
            <div
              id="view-photogallery-image-container-inner"
              className="image-screen-inner"
            />
            {get(viewScreen, `images[${activeImageIndex}].infopoints`) &&
            document.getElementById("view-photogallery-image") &&
            get(viewScreen, `images[${activeImageIndex}].imageOrigData`) &&
            document.getElementById(
              "view-photogallery-image-infopoint-hidden-0"
            )
              ? map(
                  get(viewScreen, `images[${activeImageIndex}].infopoints`),
                  (infopoint, i) =>
                    <FontIcon
                      key={i}
                      className={classNames("infopoint-icon custom-tooltip", {
                        show: infopoint.alwaysVisible
                      })}
                      style={{
                        position: "absolute",
                        top:
                          container &&
                          image &&
                          document.getElementById(
                            `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                          )
                            ? get(
                                viewScreen,
                                `images[${activeImageIndex}].imageOrigData`
                              ).height >
                              get(
                                viewScreen,
                                `images[${activeImageIndex}].imageOrigData`
                              ).width
                              ? container.height /
                                  get(
                                    viewScreen,
                                    `images[${activeImageIndex}].imageOrigData`
                                  ).height *
                                  infopoint.top +
                                image.top -
                                container.top -
                                12 -
                                document
                                  .getElementById(
                                    `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                                  )
                                  .getBoundingClientRect().height
                              : container.width /
                                  get(
                                    viewScreen,
                                    `images[${activeImageIndex}].imageOrigData`
                                  ).width *
                                  infopoint.top +
                                image.top -
                                container.top -
                                12 -
                                document
                                  .getElementById(
                                    `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                                  )
                                  .getBoundingClientRect().height
                            : 0,
                        left:
                          container &&
                          image &&
                          document.getElementById(
                            `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                          )
                            ? get(
                                viewScreen,
                                `images[${activeImageIndex}].imageOrigData`
                              ).width >
                              get(
                                viewScreen,
                                `images[${activeImageIndex}].imageOrigData`
                              ).height
                              ? container.width /
                                  get(
                                    viewScreen,
                                    `images[${activeImageIndex}].imageOrigData`
                                  ).width *
                                  infopoint.left +
                                image.left -
                                container.left -
                                document
                                  .getElementById(
                                    `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                                  )
                                  .getBoundingClientRect().width /
                                  2
                              : container.height /
                                  get(
                                    viewScreen,
                                    `images[${activeImageIndex}].imageOrigData`
                                  ).height *
                                  infopoint.left +
                                image.left -
                                container.left -
                                document
                                  .getElementById(
                                    `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                                  )
                                  .getBoundingClientRect().width /
                                  2
                            : 0
                      }}
                    >
                      <div className="tooltip-text">{infopoint.text}</div>
                      help_outline
                    </FontIcon>
                )
              : <div />}
          </div>}
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
  withState("timeouts", "setTimeouts", []),
  withState(
    "animationTypeState",
    "setAnimationTypeState",
    animationType.WITHOUT
  ),
  withState("activeImageIndex", "setActiveImageIndex", 0),
  lifecycle({
    componentDidMount() {
      const {
        viewScreen,
        setTimeouts,
        setAnimationTypeState,
        screenFiles,
        setActiveImageIndex
      } = this.props;

      if (!isEmpty(viewScreen.images)) {
        const timeouts = [];
        const animationTime = 1.3;

        const container = document
          .getElementById("view-photogallery-image-container")
          .getBoundingClientRect();

        const newNode = screenFiles["images[0]"];

        newNode.id = "view-photogallery-image";
        newNode.setAttribute(
          "style",
          `top: ${viewScreen.images[0].imageOrigData.height >
          viewScreen.images[0].imageOrigData.width
            ? 0
            : container.height / 2 -
              viewScreen.images[0].imageOrigData.height *
                (container.width / viewScreen.images[0].imageOrigData.width) /
                2}px; left: ${viewScreen.images[0].imageOrigData.width >
          viewScreen.images[0].imageOrigData.height
            ? 0
            : container.width / 2 -
              viewScreen.images[0].imageOrigData.width *
                (container.height / viewScreen.images[0].imageOrigData.height) /
                2}px; width: ${viewScreen.images[0].imageOrigData.height >
          viewScreen.images[0].imageOrigData.width
            ? "auto"
            : "100%"}; height: ${viewScreen.images[0].imageOrigData.height >
          viewScreen.images[0].imageOrigData.width
            ? "100%"
            : "auto"};`
        );
        document
          .getElementById("view-photogallery-image-container-inner")
          .prepend(newNode);

        const showTime =
          viewScreen.time &&
          viewScreen.time > 0 &&
          (viewScreen.time * 1000 -
            (viewScreen.images.length - 1) * 2 * animationTime * 1000) /
            viewScreen.images.length >
            0
            ? (viewScreen.time * 1000 -
                (viewScreen.images.length - 1) * 2 * animationTime * 1000) /
              viewScreen.images.length
            : 1000;

        forEach(viewScreen.images, (image, i) => {
          if (i) {
            timeouts.push(
              setTimeout(() => {
                setAnimationTypeState(animationType.WITHOUT);
              }, (showTime + 2 * animationTime * 1000) * i)
            );
          }
          if (i + 1 < viewScreen.images.length) {
            timeouts.push(
              setTimeout(() => {
                setAnimationTypeState(
                  viewScreen.animationType === animationType.FADE_IN_OUT
                    ? animationType.FADE_OUT
                    : viewScreen.animationType === animationType.FLY_IN_OUT
                      ? animationType.FLY_OUT
                      : animationType.WITHOUT
                );
              }, showTime * (i + 1) + 2 * animationTime * 1000 * i)
            );

            timeouts.push(
              setTimeout(() => {
                document.getElementById("view-photogallery-image").outerHTML =
                  "";
                delete document.getElementById("view-photogallery-image");
                setActiveImageIndex(i + 1);
                setAnimationTypeState(
                  viewScreen.animationType === animationType.FADE_IN_OUT
                    ? animationType.FADE_IN
                    : viewScreen.animationType === animationType.FLY_IN_OUT
                      ? animationType.FLY_IN
                      : animationType.WITHOUT
                );

                const container = document
                  .getElementById("view-photogallery-image-container")
                  .getBoundingClientRect();

                const newNode = screenFiles[`images[${i + 1}]`];

                newNode.id = "view-photogallery-image";
                newNode.setAttribute(
                  "style",
                  `top: ${viewScreen.images[i + 1].imageOrigData.height >
                  viewScreen.images[i + 1].imageOrigData.width
                    ? 0
                    : container.height / 2 -
                      viewScreen.images[i + 1].imageOrigData.height *
                        (container.width /
                          viewScreen.images[i + 1].imageOrigData.width) /
                        2}px; left: ${viewScreen.images[i + 1].imageOrigData
                    .width > viewScreen.images[i + 1].imageOrigData.height
                    ? 0
                    : container.width / 2 -
                      viewScreen.images[i + 1].imageOrigData.width *
                        (container.height /
                          viewScreen.images[i + 1].imageOrigData.height) /
                        2}px; width: ${viewScreen.images[i + 1].imageOrigData
                    .height > viewScreen.images[i + 1].imageOrigData.width
                    ? "auto"
                    : "100%"}; height: ${viewScreen.images[i + 1].imageOrigData
                    .height > viewScreen.images[i + 1].imageOrigData.width
                    ? "100%"
                    : "auto"};`
                );
                document
                  .getElementById("view-photogallery-image-container-inner")
                  .prepend(newNode);
              }, (showTime + animationTime * 1000) * (i + 1) + animationTime * 1000 * i)
            );
          }
        });

        setTimeouts(timeouts);
      }
    },
    componentWillUnmount() {
      const { timeouts } = this.props;

      forEach(timeouts, t => clearTimeout(t));
    }
  })
)(ViewPhotogallery);
