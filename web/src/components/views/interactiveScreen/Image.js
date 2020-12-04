import React from "react";
import { map, get } from "lodash";
import { compose, lifecycle } from "recompose";
import classNames from "classnames";

import InfopointIcon from "../../InfopointIcon";

const Image = ({ viewScreen, activeImageIndex, screenType }) => {
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
          : get(viewScreen, `images[${activeImageIndex}].infopoints`),
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
      <div className="interactive-screen-image-container-inner">
        {viewScreen.image &&
          viewScreen.imageOrigData &&
          (viewScreen.infopoints || viewScreen.sequences) &&
          document.getElementById("interactive-screen-image-container") &&
          document.getElementById("interactive-screen-image") &&
          map(
            viewScreen.infopoints
              ? viewScreen.infopoints
              : viewScreen.sequences,
            (item, i) => (
              <div className="image-screen-infopoint" key={i}>
                <InfopointIcon
                  className={classNames("infopoint-icon custom-tooltip", {
                    show: item.alwaysVisible
                  })}
                  style={(() => {
                    const height = viewScreen.imageOrigData.height;
                    const width = viewScreen.imageOrigData.width;

                    const hiddenElement = document.getElementById(
                      `inveractive-image-infopoint-tooltip-hidden-${i}`
                    );

                    if (!hiddenElement) {
                      return {
                        position: "absolute",
                        top: 0,
                        left: 0
                      };
                    }

                    const imageSize = document
                      .getElementById("interactive-screen-image")
                      .getBoundingClientRect();

                    const containerSize = document
                      .getElementById(
                        "interactive-screen-image-container-inner"
                      )
                      .getBoundingClientRect();

                    const hiddenElementSize = document
                      .getElementById(
                        `inveractive-image-infopoint-tooltip-hidden-${i}`
                      )
                      .getBoundingClientRect();

                    return {
                      position: "absolute",
                      top:
                        imageSize.top -
                        containerSize.top +
                        item.top * (imageSize.height / height) -
                        24 -
                        hiddenElementSize.height,
                      left:
                        (containerSize.width - imageSize.width) / 2 +
                        item.left * (imageSize.width / width) -
                        hiddenElementSize.width / 2
                    };
                  })()}
                >
                  <div className="tooltip-text">{item.text}</div>
                </InfopointIcon>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default compose(
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles } = this.props;

      if (viewScreen.image && screenFiles["image"]) {
        const newNode = screenFiles["image"];

        newNode.id = "interactive-screen-image";
        newNode.className = "";
        newNode.setAttribute("style", `max-width: 100%; max-height: 100%;`);

        document
          .getElementById("interactive-screen-image-container-inner")
          .appendChild(newNode);
      }
    }
  })
)(Image);
