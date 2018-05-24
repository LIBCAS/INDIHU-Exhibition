import React from "react";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { connect } from "react-redux";
import classNames from "classnames";
import { get } from "lodash";

import ScreenMenu from "../../components/views/ScreenMenu";
import { getFileById } from "../../actions/fileActions";

import { animationType } from "../../enums/animationType";

const ViewImageChange = ({
  viewScreen,
  handleClick,
  handleSlider,
  sliderValue
}) => {
  const animClick = viewScreen.animationType === animationType.CLICK;
  const animSlideV = viewScreen.animationType === animationType.VERTICAL;
  const animSlideH = viewScreen.animationType === animationType.HORIZONTAL;

  return (
    <div className="viewer-screen">
      <div
        id="view-imagechange-image-container"
        className="view-imagechange-image-container"
        onClick={() => animClick && handleClick()}
      >
        {(animSlideV || animSlideH) &&
          <div className="slide-container">
            <div id="back" className="back">
              <div
                id="front"
                className={classNames("front", {
                  horizontal: animSlideH,
                  vertical: animSlideV
                })}
              />
            </div>
            <input
              id="slider"
              className={classNames("slider", { vertical: animSlideV })}
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={e => {
                handleSlider(e.target.value, animSlideV);
              }}
            />
          </div>}
      </div>
      <ScreenMenu viewScreen={viewScreen} />
    </div>
  );
};

export default compose(
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), {
    getFileById
  }),
  withState("imageChanged", "setImageChanged", false),
  withState("sliderValue", "setSliderValue", 50),
  withState("loadingInterval", "setLoadingInterval", null),
  withHandlers({
    handleClick: ({ viewScreen, imageChanged, setImageChanged }) => () => {
      if (imageChanged) {
        setImageChanged(false);

        document
          .getElementById("interactive-screen-image1")
          .setAttribute(
            "style",
            `width: ${viewScreen.image1OrigData.height >
            viewScreen.image1OrigData.width
              ? "auto"
              : "100%"}; height: ${viewScreen.image1OrigData.height >
            viewScreen.image1OrigData.width
              ? "100%"
              : "auto"};`
          );

        document
          .getElementById("interactive-screen-image2")
          .setAttribute(
            "style",
            `width: ${viewScreen.image2OrigData.height >
            viewScreen.image2OrigData.width
              ? "auto"
              : "100%"}; height: ${viewScreen.image2OrigData.height >
            viewScreen.image2OrigData.width
              ? "100%"
              : "auto"}; opacity: 0; filter: alpha(opacity=0);`
          );
      } else {
        setImageChanged(true);

        document
          .getElementById("interactive-screen-image1")
          .setAttribute(
            "style",
            `width: ${viewScreen.image1OrigData.height >
            viewScreen.image1OrigData.width
              ? "auto"
              : "100%"}; height: ${viewScreen.image1OrigData.height >
            viewScreen.image1OrigData.width
              ? "100%"
              : "auto"}; opacity: 0; filter: alpha(opacity=0);`
          );

        document
          .getElementById("interactive-screen-image2")
          .setAttribute(
            "style",
            `width: ${viewScreen.image2OrigData.height >
            viewScreen.image2OrigData.width
              ? "auto"
              : "100%"}; height: ${viewScreen.image2OrigData.height >
            viewScreen.image2OrigData.width
              ? "100%"
              : "auto"};`
          );
      }
    },
    handleSlider: ({ viewScreen, getFileById, setSliderValue }) => (
      value,
      animSlideV
    ) => {
      setSliderValue(value);

      const back = document.getElementById("back");
      const front = document.getElementById("front");
      const frontImage = document.getElementById("front-image");
      const backImage = document.getElementById("back-image");

      if (back && front && frontImage) {
        front.setAttribute(
          "style",
          animSlideV ? `height: ${value}%;` : `width: ${value}%;`
        );

        frontImage.setAttribute(
          "style",
          `top: ${back.getBoundingClientRect().height / 2 -
            frontImage.getBoundingClientRect().height /
              2}px; left: ${back.getBoundingClientRect().width / 2 -
            frontImage.getBoundingClientRect().width /
              2}px; height: ${frontImage.getBoundingClientRect().height /
            back.getBoundingClientRect().height >
          frontImage.getBoundingClientRect().width /
            back.getBoundingClientRect().width
            ? back.getBoundingClientRect().height
            : back.getBoundingClientRect().width /
              get(viewScreen, "image2OrigData.width") *
              get(
                viewScreen,
                "image2OrigData.height"
              )}px; width: ${frontImage.getBoundingClientRect().width /
            back.getBoundingClientRect().width >
          frontImage.getBoundingClientRect().height /
            back.getBoundingClientRect().height
            ? back.getBoundingClientRect().width
            : back.getBoundingClientRect().height /
              get(viewScreen, "image2OrigData.height") *
              get(viewScreen, "image2OrigData.width")}px;`
        );
      }

      if (back && backImage) {
        backImage.setAttribute(
          "style",
          `top: ${back.getBoundingClientRect().height / 2 -
            backImage.getBoundingClientRect().height /
              2}px; left: ${back.getBoundingClientRect().width / 2 -
            backImage.getBoundingClientRect().width /
              2}px; height: ${backImage.getBoundingClientRect().height /
            back.getBoundingClientRect().height >
          backImage.getBoundingClientRect().width /
            back.getBoundingClientRect().width
            ? back.getBoundingClientRect().height
            : back.getBoundingClientRect().width /
              get(viewScreen, "image1OrigData.width") *
              get(
                viewScreen,
                "image1OrigData.height"
              )}px; width: ${backImage.getBoundingClientRect().width /
            back.getBoundingClientRect().width >
          backImage.getBoundingClientRect().height /
            back.getBoundingClientRect().height
            ? back.getBoundingClientRect().width
            : back.getBoundingClientRect().height /
              get(viewScreen, "image1OrigData.height") *
              get(viewScreen, "image1OrigData.width")}px;`
        );
      }
    },
    handlerAnimSlideV: () => () => {
      document
        .getElementById("slider")
        .setAttribute("style", `right: ${-window.innerHeight / 2 + 50}px`);
    },
    loadingImages: ({
      viewScreen,
      animSlideV,
      loadingInterval,
      setLoadingInterval
    }) => () => {
      const back = document.getElementById("back");
      const front = document.getElementById("front");
      const frontImage = document.getElementById("front-image");
      const backImage = document.getElementById("back-image");

      if (back && front && frontImage) {
        frontImage.setAttribute(
          "style",
          `top: ${back.getBoundingClientRect().height / 2 -
            frontImage.getBoundingClientRect().height /
              2}px; left: ${back.getBoundingClientRect().width / 2 -
            frontImage.getBoundingClientRect().width /
              2}px; height: ${frontImage.getBoundingClientRect().height /
            back.getBoundingClientRect().height >
          frontImage.getBoundingClientRect().width /
            back.getBoundingClientRect().width
            ? back.getBoundingClientRect().height
            : back.getBoundingClientRect().width /
              get(viewScreen, "image2OrigData.width") *
              get(
                viewScreen,
                "image2OrigData.height"
              )}px; width: ${frontImage.getBoundingClientRect().width /
            back.getBoundingClientRect().width >
          frontImage.getBoundingClientRect().height /
            back.getBoundingClientRect().height
            ? back.getBoundingClientRect().width
            : back.getBoundingClientRect().height /
              get(viewScreen, "image2OrigData.height") *
              get(viewScreen, "image2OrigData.width")}px;`
        );
      }

      if (back && backImage) {
        backImage.setAttribute(
          "style",
          `top: ${back.getBoundingClientRect().height / 2 -
            backImage.getBoundingClientRect().height /
              2}px; left: ${back.getBoundingClientRect().width / 2 -
            backImage.getBoundingClientRect().width /
              2}px; height: ${backImage.getBoundingClientRect().height /
            back.getBoundingClientRect().height >
          backImage.getBoundingClientRect().width /
            back.getBoundingClientRect().width
            ? back.getBoundingClientRect().height
            : back.getBoundingClientRect().width /
              get(viewScreen, "image1OrigData.width") *
              get(
                viewScreen,
                "image1OrigData.height"
              )}px; width: ${backImage.getBoundingClientRect().width /
            back.getBoundingClientRect().width >
          backImage.getBoundingClientRect().height /
            back.getBoundingClientRect().height
            ? back.getBoundingClientRect().width
            : back.getBoundingClientRect().height /
              get(viewScreen, "image1OrigData.height") *
              get(viewScreen, "image1OrigData.width")}px;`
        );
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const {
        viewScreen,
        screenFiles,
        handlerAnimSlideV,
        setLoadingInterval,
        loadingImages
      } = this.props;

      const animHover = viewScreen.animationType === animationType.HOVER;
      const animClick = viewScreen.animationType === animationType.CLICK;
      const animSlideV = viewScreen.animationType === animationType.VERTICAL;
      const animSlideH = viewScreen.animationType === animationType.HORIZONTAL;
      const animFadeInOut =
        viewScreen.animationType === animationType.FADE_IN_OUT_TWO_IMAGES;

      if (animFadeInOut) {
        if (viewScreen.image1) {
          const newNode = screenFiles["image1"];

          newNode.id = "view-imagechange-image1";

          if (viewScreen.image2) {
            newNode.className = "animation-fade-out";
            newNode.setAttribute(
              "style",
              `animation-duration: ${viewScreen.time && viewScreen.time > 0
                ? viewScreen.time
                : 20}s;`
            );
          }
          document
            .getElementById("view-imagechange-image-container")
            .prepend(newNode);
        }

        if (viewScreen.image2) {
          const newNode = screenFiles["image2"];

          newNode.id = "view-imagechange-image2";

          if (viewScreen.image1) {
            newNode.className = "animation-fade-in";
            newNode.setAttribute(
              "style",
              `animation-duration: ${viewScreen.time && viewScreen.time > 0
                ? viewScreen.time
                : 20}s;`
            );
          }
          document
            .getElementById("view-imagechange-image-container")
            .prepend(newNode);
        }
      } else if (animHover || animClick) {
        document.getElementById("view-imagechange-image-container").className +=
          " click-hover";

        if (viewScreen.image1 && screenFiles["image1"]) {
          const newNode = screenFiles["image1"];

          newNode.id = "interactive-screen-image1";
          newNode.className = "";

          if (animHover) {
            newNode.className = "interactive-screen-image1";
          }

          newNode.setAttribute(
            "style",
            `width: ${viewScreen.image1OrigData.height >
            viewScreen.image1OrigData.width
              ? "auto"
              : "100%"}; height: ${viewScreen.image1OrigData.height >
            viewScreen.image1OrigData.width
              ? "100%"
              : "auto"}`
          );

          document
            .getElementById("view-imagechange-image-container")
            .prepend(newNode);
        }

        if (viewScreen.image2 && screenFiles["image2"]) {
          const newNode = screenFiles["image2"];

          newNode.id = "interactive-screen-image2";
          newNode.className = "";

          if (animHover) {
            newNode.className = "interactive-screen-image2";
          }

          newNode.setAttribute(
            "style",
            `width: ${viewScreen.image2OrigData.height >
            viewScreen.image2OrigData.width
              ? "auto"
              : "100%"}; height: ${viewScreen.image2OrigData.height >
            viewScreen.image2OrigData.width
              ? "100%"
              : "auto"}; ${animClick
              ? `opacity: 0; filter: alpha(opacity=0);`
              : ""}`
          );

          document
            .getElementById("view-imagechange-image-container")
            .prepend(newNode);
        }
      } else if (animSlideH || animSlideV) {
        if (animSlideV) {
          handlerAnimSlideV();
          window.addEventListener("resize", () => handlerAnimSlideV());
        }

        const container = document.getElementById(
          "view-imagechange-image-container"
        );
        const imgWidth = container.offsetWidth;
        const imgHeight = container.offsetHeight;

        if (viewScreen.image1 && screenFiles["image1"]) {
          const newNode = screenFiles["image1"];
          animSlideV
            ? (newNode.height = imgHeight)
            : (newNode.width = imgWidth);
          newNode.id = "back-image";
          newNode.style = null;
          newNode.className = null;
          document.getElementById("back").prepend(newNode);
        }
        if (viewScreen.image2 && screenFiles["image2"]) {
          const newNode = screenFiles["image2"];
          animSlideV
            ? (newNode.height = imgHeight)
            : (newNode.width = imgWidth);
          newNode.id = "front-image";
          newNode.style = null;
          newNode.className = null;
          document.getElementById("front").prepend(newNode);
        }

        setLoadingInterval(setInterval(loadingImages, 300));
      }
    },
    componentWillUnmount() {
      const {
        viewScreen,
        handlerAnimSlideV,
        loadingInterval,
        setLoadingInterval
      } = this.props;

      const animSlideV = viewScreen.animationType === animationType.VERTICAL;

      if (animSlideV) {
        window.removeEventListener("resize", () => handlerAnimSlideV());
      }

      if (loadingInterval) {
        clearInterval(loadingInterval);
        setLoadingInterval(null);
      }
    }
  })
)(ViewImageChange);
