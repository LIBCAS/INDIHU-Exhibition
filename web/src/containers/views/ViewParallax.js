import React from "react";
import { compose, lifecycle } from "recompose";
import { connect } from "react-redux";
import { isEmpty, forEach } from "lodash";
import classNames from "classnames";

import ScreenMenu from "../../components/views/ScreenMenu";

import { animationType } from "../../enums/animationType";

const ViewParallax = ({ viewScreen }) => {
  return (
    <div>
      <div id="view-parallax-images-container" className="viewer-screen" />
      <ScreenMenu viewScreen={viewScreen} />
    </div>
  );
};

export default compose(
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null),
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles } = this.props;

      if (!isEmpty(viewScreen.images)) {
        forEach(viewScreen.images, (img, i) => {
          const newNode = screenFiles[`images[${i}]`];

          newNode.className = classNames("parallax-image", {
            "animation-parallaxSlideDown":
              i > 0 && viewScreen.animationType === animationType.FROM_TOP,
            "animation-parallaxSlideUp":
              i > 0 && viewScreen.animationType === animationType.FROM_BOTTOM,
            "animation-parallaxSlideLeft":
              i > 0 &&
              viewScreen.animationType === animationType.FROM_RIGHT_TO_LEFT,
            "animation-parallaxSlideRight":
              i > 0 &&
              viewScreen.animationType === animationType.FROM_LEFT_TO_RIGHT,
            "parallax-background": i === 0,
            center: i > 0 && viewScreen.animationType === animationType.WITHOUT,
            "center-vertical":
              i > 0 &&
              (viewScreen.animationType === animationType.FROM_RIGHT_TO_LEFT ||
                viewScreen.animationType === animationType.FROM_LEFT_TO_RIGHT),
            "center-horizontal":
              i > 0 &&
              (viewScreen.animationType === animationType.FROM_TOP ||
                viewScreen.animationType === animationType.FROM_BOTTOM)
          });

          newNode.setAttribute(
            "style",
            i > 0
              ? viewScreen.time && viewScreen.time > 0
                ? `animation-duration: ${viewScreen.time / i}s`
                : `animation-duration: ${20 / i}s`
              : ""
          );

          document
            .getElementById("view-parallax-images-container")
            .appendChild(newNode);
        });
      }
    }
  })
)(ViewParallax);
