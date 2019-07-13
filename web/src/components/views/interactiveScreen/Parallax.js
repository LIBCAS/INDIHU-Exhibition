import React from "react";
import { forEach, isEmpty } from "lodash";
import classNames from "classnames";
import { compose, lifecycle, withState } from "recompose";
import { getObjectFitSize, getImageData } from "../../../utils/viewer";

const InteractiveParallax = () => {
  return (
    <div id="parallax-container" className="parallax-container">
      <div id="parallax-container-inner" className="parallax-container-inner" />
    </div>
  );
};

export default compose(
  withState("parallaxState", "setParallaxState", 0),
  lifecycle({
    componentDidMount() {
      const { screenFiles, viewScreen } = this.props;

      if (!isEmpty(viewScreen.images) && screenFiles[`images[0]`]) {
        const containerInner = document.getElementById(
          "parallax-container-inner"
        );
        const backgroundImage = screenFiles[`images[0]`];
        backgroundImage.id = `parallax-image-0`;
        containerInner.appendChild(backgroundImage);

        forEach(viewScreen.images, (_, i) => {
          if (i > 0 && screenFiles[`images[${i}]`]) {
            const backgroundImage = document.getElementById(`parallax-image-0`);

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

            newNode.id = `parallax-image-${i}`;
            newNode.className = classNames("parallax-image center");

            const width = newNode.naturalWidth / backgroundImageData.ratio;
            const height = newNode.naturalHeight / backgroundImageData.ratio;

            newNode.setAttribute(
              "style",
              ` width: ${width}px; height: ${height}px;`
            );

            document.getElementById("parallax-container").appendChild(newNode);
          }
        });
      }
    }
  })
)(InteractiveParallax);
