import React from "react";
import { withRouter } from "react-router-dom";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { connect } from "react-redux";
import { isEmpty, forEach } from "lodash";
import classNames from "classnames";

import InfopointIcon from "../../components/InfopointIcon";
import ScreenMenu from "../../components/views/ScreenMenu";
import { zoomInTooltipPosition } from "../../enums/screenEnums";

const timeS = 2;
const timeM = timeS * 1000;

const ViewZoomIn = ({ viewScreen, infoText, tooltipVisible }) => {
  const bottomRight =
    !viewScreen.tooltipPosition ||
    viewScreen.tooltipPosition === zoomInTooltipPosition.BOTTOM_RIGHT;
  const topLeft = viewScreen.tooltipPosition === zoomInTooltipPosition.TOP_LEFT;
  const topRight =
    viewScreen.tooltipPosition === zoomInTooltipPosition.TOP_RIGHT;
  return (
    <div>
      <div className="viewer-screen">
        <div id="view-zoom-in-container" className="image-container zoom-in" />
        <InfopointIcon
          id="tooltip"
          className="infopoint-icon"
          style={{
            position: "absolute",
            bottom: bottomRight ? 10 : "auto",
            top: topLeft || topRight ? 40 : "auto",
            right: bottomRight || topRight ? 10 : "auto",
            left: topLeft ? 10 : "auto"
          }}
        />
        {tooltipVisible && (
          <div
            className={classNames("infopoint-tooltip zoom-in-tooltip", {
              short: bottomRight
            })}
            style={{
              bottom: bottomRight ? 10 : "auto",
              top: topLeft || topRight ? 40 : "auto",
              right: bottomRight || topRight ? 55 : "auto",
              left: topLeft ? 55 : "auto"
            }}
          >
            {infoText}
          </div>
        )}
      </div>
      <ScreenMenu viewScreen={viewScreen} />
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({ expo: { viewScreen } }) => ({ viewScreen }),
    null
  ),
  withState("timeouts", "setTimeouts", null),
  withState("imageLoadInterval", "setImageLoadInterval", null),
  withState("infoText", "setInfoText", null),
  withState("tooltipVisible", "setTooltipVisible", false),
  withHandlers({
    makeCircus: ({
      viewScreen,
      setTimeouts,
      setInfoText,
      setTooltipVisible
    }) => () => {
      const image = document.getElementById("view-zoom-in-image");

      const defX = image.getBoundingClientRect().width / 2;
      const defY = image.getBoundingClientRect().height / 2;

      const timeouts = [];
      let lastSequenceTime = 0;

      if (!isEmpty(viewScreen.sequences)) {
        forEach(viewScreen.sequences, seq => {
          const moveConst = seq.zoom / 2;
          const zoomTime = seq.time ? seq.time * 1000 : timeM;

          // wait and zoom in
          timeouts.push(
            setTimeout(() => {
              document.getElementById("view-zoom-in-image").setAttribute(
                "style",
                `transition: transform ${moveConst * timeS}s;
                transform: translate(${-defX +
                  (defX -
                    seq.left *
                      (image.getBoundingClientRect().width /
                        viewScreen.imageOrigData.width)) *
                    seq.zoom}px, ${-defY +
                  (defY -
                    seq.top *
                      (image.getBoundingClientRect().height /
                        viewScreen.imageOrigData.height)) *
                    seq.zoom}px) scale(${seq.zoom})`
              );
              setInfoText(seq.text);
              setTooltipVisible(true);
            }, lastSequenceTime + timeM)
          );

          // update seq time
          lastSequenceTime += timeM + moveConst * timeM;

          // wait and zoom out
          timeouts.push(
            setTimeout(() => {
              document.getElementById("view-zoom-in-image").setAttribute(
                "style",
                `transition: transform ${moveConst * timeS}s;
                transform: translate(${-defX}px, ${-defY}px) scale(1)`
              );
              setTooltipVisible(true);
            }, lastSequenceTime + zoomTime)
          );

          // gift for next loop
          lastSequenceTime += zoomTime + moveConst * timeM;
        });
      }

      setTimeouts(timeouts);
    }
  }),
  withHandlers({
    imageOnLoad: ({ makeCircus, imageLoadInterval }) => () => {
      const image = document.getElementById("view-zoom-in-image");

      if (
        image &&
        (image.getBoundingClientRect().width > 0 &&
          image.getBoundingClientRect().height > 0)
      ) {
        image.setAttribute(
          "style",
          `transition: transform 0s; transform: translate(${-image.getBoundingClientRect()
            .width / 2}px, ${-image.getBoundingClientRect().height /
            2}px) scale(1)`
        );

        makeCircus();
        clearInterval(imageLoadInterval);
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const {
        viewScreen,
        screenFiles,
        imageOnLoad,
        setImageLoadInterval
      } = this.props;

      if (viewScreen.image) {
        const newNode = screenFiles["image"];

        newNode.id = "view-zoom-in-image";
        document.getElementById("view-zoom-in-container").appendChild(newNode);

        setImageLoadInterval(setInterval(imageOnLoad, 100));
      }
    },
    componentWillUnmount() {
      const { timeouts, imageLoadInterval } = this.props;
      forEach(timeouts, timeout => clearTimeout(timeout));

      clearInterval(imageLoadInterval);
    }
  })
)(ViewZoomIn);
