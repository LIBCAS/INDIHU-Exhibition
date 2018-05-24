import React from "react";
import { withRouter } from "react-router-dom";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { connect } from "react-redux";
import { isEmpty, forEach } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import ReactTooltip from "react-tooltip";

import ScreenMenu from "../../components/views/ScreenMenu";

const timeS = 2;
const timeM = timeS * 1000;

const ViewZoomIn = ({
  viewScreen,
  actTime,
  actPosition,
  actScale,
  infoText
}) => {
  return (
    <div>
      <div className="viewer-screen">
        <div id="view-zoom-in-container" className="image-container zoom-in" />
        <FontIcon
          id="tooltip"
          className="infopoint-icon"
          style={{
            position: "absolute",
            bottom: 10,
            right: 10
          }}
          data-tip={infoText}
        >
          help_outline
        </FontIcon>
        <ReactTooltip
          className="infopoint-tooltip"
          type="dark"
          effect="solid"
        />
      </div>
      <ScreenMenu viewScreen={viewScreen} />
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null),
  withState("timeouts", "setTimeouts", null),
  withState("imageLoadInterval", "setImageLoadInterval", null),
  withState("infoText", "setInfoText", null),
  withHandlers({
    makeCircus: ({ viewScreen, setTimeouts, setInfoText }) => () => {
      const image = document.getElementById("view-zoom-in-image");

      const defX = image.getBoundingClientRect().width / 2;
      const defY = image.getBoundingClientRect().height / 2;

      const timeouts = [];
      let lastSequenceTime = 0;

      if (!isEmpty(viewScreen.sequences)) {
        forEach(viewScreen.sequences, seq => {
          const moveConst = seq.zoom / 2;

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
              ReactTooltip.show(document.getElementById("tooltip"));
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
              ReactTooltip.hide(document.getElementById("tooltip"));
            }, lastSequenceTime + 2 * timeM)
          );

          // gift for next loop
          lastSequenceTime += 2 * timeM + moveConst * timeM;
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
