import React from "react";
import { compose, lifecycle } from "recompose";
import { connect } from "react-redux";
import { isEmpty, forEach } from "lodash";
import classNames from "classnames";
import createKeyframe from "create-keyframe";
import insertStyles from "insert-styles";

import ScreenMenu from "../../components/views/ScreenMenu";
import { animationType } from "../../enums/animationType";
import { getObjectFitSize, getImageData } from "../../utils/viewer";

const ViewParallax = ({ viewScreen }) => {
  return (
    <div>
      <div className="viewer-screen">
        <div
          id="view-parallax-images-container"
          className="parallax-images-container"
        >
          <div
            id="view-parallax-images-container-inner"
            className="parallax-images-container-inner"
          />
        </div>
      </div>
      <ScreenMenu viewScreen={viewScreen} />
    </div>
  );
};

export default compose(
  connect(
    ({ expo: { viewScreen } }) => ({ viewScreen }),
    null
  ),
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles } = this.props;

      const animationFromLeftToRight =
        viewScreen.animationType === animationType.FROM_LEFT_TO_RIGHT;
      const animationFromRightToLeft =
        viewScreen.animationType === animationType.FROM_RIGHT_TO_LEFT;
      const animationFromTop =
        viewScreen.animationType === animationType.FROM_TOP;
      const animationFromBottom =
        viewScreen.animationType === animationType.FROM_BOTTOM;
      const animationWithout =
        viewScreen.animationType === animationType.WITHOUT;
      const someAnimation =
        animationFromLeftToRight ||
        animationFromRightToLeft ||
        animationFromTop ||
        animationFromBottom;

      if (!isEmpty(viewScreen.images)) {
        const containerInner = document.getElementById(
          "view-parallax-images-container-inner"
        );
        const backgroundImage = screenFiles[`images[0]`];
        backgroundImage.id = `view-parallax-image-0`;
        containerInner.appendChild(backgroundImage);

        const time = viewScreen && viewScreen.time ? viewScreen.time : 20;
        const maxMoveSize = 0.2;
        forEach(viewScreen.images, (_, i) => {
          if (i > 0) {
            const backgroundImage = document.getElementById(
              `view-parallax-image-0`
            );

            const objectFitSize = getObjectFitSize(
              true,
              backgroundImage.width,
              backgroundImage.height,
              backgroundImage.naturalWidth,
              backgroundImage.naturalHeight
            );
            const backgroundImageData = getImageData(
              containerInner.getBoundingClientRect().width,
              containerInner.getBoundingClientRect().height,
              backgroundImage.naturalWidth,
              backgroundImage.naturalHeight,
              objectFitSize.width,
              objectFitSize.height
            );

            const newNode = screenFiles[`images[${i}]`];

            newNode.id = `view-parallax-image-${i}`;

            newNode.className = classNames("parallax-image", {
              center: animationWithout,
              "center-vertical":
                animationFromLeftToRight || animationFromRightToLeft,
              "center-horizontal": animationFromTop || animationFromBottom
            });

            const width = newNode.naturalWidth / backgroundImageData.ratio;
            const height = newNode.naturalHeight / backgroundImageData.ratio;
            const left = objectFitSize.x + objectFitSize.width / 2 - width / 2;
            const top = objectFitSize.y + objectFitSize.height / 2 - height / 2;
            const moveSize = (maxMoveSize / (viewScreen.images.length - 1)) * i;

            if (someAnimation) {
              var keyframeObj = createKeyframe({
                0: {
                  transform: animationFromLeftToRight
                    ? `translate(${-width * moveSize}px, -50%)`
                    : animationFromRightToLeft
                    ? `translate(${width * moveSize}px, -50%)`
                    : animationFromTop
                    ? `translate(-50%, ${-height * moveSize}px)`
                    : `translate(-50%, ${height * moveSize}px)`
                },
                100: {
                  transform:
                    animationFromLeftToRight || animationFromRightToLeft
                      ? `translate(0px, -50%)`
                      : `translate(-50%, 0px)`
                }
              });
              insertStyles(keyframeObj.css);
            }

            newNode.setAttribute(
              "style",
              `${
                animationFromLeftToRight || animationFromRightToLeft
                  ? `left: ${left}px;`
                  : animationFromTop || animationFromBottom
                  ? `top: ${top}px;`
                  : ""
              } width: ${width}px; height: ${height}px;${
                someAnimation
                  ? `animation: ${keyframeObj.name} linear ${time}s`
                  : ""
              }`
            );

            document
              .getElementById("view-parallax-images-container")
              .appendChild(newNode);
          }
        });
      }
    }
  })
)(ViewParallax);
