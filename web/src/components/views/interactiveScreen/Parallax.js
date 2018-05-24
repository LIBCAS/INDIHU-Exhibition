import React from "react";
import { forEach } from "lodash";
import classNames from "classnames";
import { compose, lifecycle, withState } from "recompose";

const InteractiveParallax = ({ viewScreen, parallaxState }) => {
  return <div id="parallax-container" className="parallax-container" />;
};

export default compose(
  withState("parallaxState", "setParallaxState", 0),
  lifecycle({
    componentDidMount() {
      const { screenFiles, viewScreen } = this.props;

      if (viewScreen.images) {
        forEach(viewScreen.images, (img, i) => {
          if (screenFiles[`images[${i}]`]) {
            const newNode = screenFiles[`images[${i}]`];

            newNode.id = `parallax-image-${i}`;
            newNode.className = classNames("parallax-image center", {
              "parallax-background": i === 0
            });

            document.getElementById("parallax-container").appendChild(newNode);
          }
        });
      }
    }
  })
)(InteractiveParallax);
