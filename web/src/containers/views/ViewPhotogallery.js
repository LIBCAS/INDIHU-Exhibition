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

const getImageData = (
  containerWidth,
  containerHeight,
  elementWidth,
  elementHeight
) => {
  let left = (containerWidth - elementWidth) / 2;
  let top = (containerHeight - elementHeight) / 2;
  let ratio = 1;

  const widthRatio = elementWidth / containerWidth;
  const heightRatio = elementHeight / containerHeight;

  if (widthRatio > 1 || heightRatio > 1) {
    if (widthRatio > heightRatio) {
      left = 0;
      top = (containerHeight - elementHeight / widthRatio) / 2;
      ratio = widthRatio;
    } else {
      top = 0;
      left = (containerWidth - elementWidth / heightRatio) / 2;
      ratio = heightRatio;
    }
  }

  return { left, top, ratio };
};

const ViewPhotogallery = ({
  viewScreen,
  activeImageIndex,
  animationTypeState
}) => {
  const container = document.getElementById("view-photogallery-image-container")
    ? document
        .getElementById("view-photogallery-image-container")
        .getBoundingClientRect()
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

  const imageData = container
    ? getImageData(
        container.width,
        container.height,
        get(viewScreen, `images[${activeImageIndex}].imageOrigData.width`),
        get(viewScreen, `images[${activeImageIndex}].imageOrigData.height`)
      )
    : null;

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
                "infopoint-icon custom-tooltip hidden-custom-tooltip"
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
            className={classNames(
              "image-screen view-photogallery-image-container",
              {
                "animation-fade-in":
                  animationTypeState === animationType.FADE_IN,
                "animation-fade-out":
                  animationTypeState === animationType.FADE_OUT,
                "animation-fly-in": animationTypeState === animationType.FLY_IN,
                "animation-fly-out":
                  animationTypeState === animationType.FLY_OUT
              }
            )}
          >
            <div
              id="view-photogallery-image-container-inner"
              className="image-screen-inner view-photogallery-image-container-inner"
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
                          imageData &&
                          document.getElementById(
                            `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                          )
                            ? imageData.top +
                              infopoint.top / imageData.ratio -
                              document
                                .getElementById(
                                  `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                                )
                                .getBoundingClientRect().height -
                              12 / imageData.ratio
                            : 0,
                        left:
                          container &&
                          imageData &&
                          document.getElementById(
                            `view-photogallery-image-infopoint-tooltip-hidden-${i}`
                          )
                            ? imageData.left +
                              infopoint.left / imageData.ratio -
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

        // const container = document
        //   .getElementById("view-photogallery-image-container")
        //   .getBoundingClientRect();

        const newNode = screenFiles["images[0]"];
        newNode.id = "view-photogallery-image";
        newNode.setAttribute(
          "style",
          `position: static; max-width: 100%; max-height: 100%;`
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

                // const container = document
                //   .getElementById("view-photogallery-image-container")
                //   .getBoundingClientRect();

                const newNode = screenFiles[`images[${i + 1}]`];
                newNode.id = "view-photogallery-image";
                newNode.setAttribute(
                  "style",
                  `position: static; max-width: 100%; max-height: 100%;`
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
