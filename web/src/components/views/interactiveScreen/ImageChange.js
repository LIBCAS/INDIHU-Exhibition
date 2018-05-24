import React from "react";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { isEmpty } from "lodash";

const ImageChange = ({ viewScreen }) => {
  return (
    <div
      id="interactive-screen-image-change-container"
      className="interactive-screen-image-change-container"
    />
  );
};

export default compose(
  withState("positionState", "setPositionState", 0),
  withState("loadingInterval", "setLoadingInterval", null),
  withHandlers({
    imagesLoading: ({
      viewScreen,
      loadingInterval,
      setLoadingInterval,
      screenFiles
    }) => () => {
      let flag = true;

      const image1 = document.getElementById(
        "interactive-screen-image-change-image-1"
      );

      const image2 = document.getElementById(
        "interactive-screen-image-change-image-2"
      );

      if (
        (viewScreen.image1 &&
          (!image1 || image1.getBoundingClientRect().width === 0)) ||
        (viewScreen.image2 && !image2)
      ) {
        flag = false;
      } else if (viewScreen.image2 && image2) {
        image2.setAttribute(
          "style",
          `left: ${image1 ? image1.getBoundingClientRect().width + 5 : 0}px;`
        );
      }

      if (flag) {
        clearInterval(loadingInterval);
        setLoadingInterval(null);
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const {
        viewScreen,
        screenFiles,
        setLoadingInterval,
        imagesLoading
        //handlerAnimSlideV
      } = this.props;

      if (!isEmpty(screenFiles)) {
        if (viewScreen.image1) {
          const newNode = screenFiles["image1"];

          if (newNode) {
            newNode.id = "interactive-screen-image-change-image-1";
            newNode.className = "interactive-screen-image-change-image";

            newNode.setAttribute("style", "left: 0px;");

            document
              .getElementById("interactive-screen-image-change-container")
              .append(newNode);
          }
        }

        if (viewScreen.image2) {
          const newNode = screenFiles["image2"];

          if (newNode) {
            newNode.id = "interactive-screen-image-change-image-2";
            newNode.className = "interactive-screen-image-change-image";

            newNode.setAttribute(
              "style",
              `left: ${document.getElementById(
                "interactive-screen-image-change-image-1"
              )
                ? document
                    .getElementById("interactive-screen-image-change-image-1")
                    .getBoundingClientRect().right -
                  document
                    .getElementById("interactive-screen-image-change-container")
                    .getBoundingClientRect().left
                : 0}px;`
            );

            document
              .getElementById("interactive-screen-image-change-container")
              .append(newNode);
          }
        }

        setLoadingInterval(setInterval(imagesLoading, 300));
      }
    },
    componentWillReceiveProps({ scrolling }) {
      const {
        viewScreen,
        setScrolling,
        loadingInterval,
        moveForward
      } = this.props;

      if (
        (viewScreen.image1 || viewScreen.image2) &&
        scrolling &&
        !loadingInterval
      ) {
        setScrolling(false);

        const image1 = document.getElementById(
          "interactive-screen-image-change-image-1"
        );

        const image2 = document.getElementById(
          "interactive-screen-image-change-image-2"
        );

        const container = document.getElementById(
          "interactive-screen-image-change-container"
        );

        if (
          container &&
          (image1 || image2) &&
          ((moveForward &&
            ((image1 &&
              image1.getBoundingClientRect().right >
                container.getBoundingClientRect().right) ||
              (image2 &&
                image2.getBoundingClientRect().right >
                  container.getBoundingClientRect().right))) ||
            (!moveForward &&
              ((image1 &&
                image1.getBoundingClientRect().left <
                  container.getBoundingClientRect().left) ||
                (image2 &&
                  image2.getBoundingClientRect().left <
                    container.getBoundingClientRect().left))))
        ) {
          const move = moveForward
            ? -container.getBoundingClientRect().width / 50
            : container.getBoundingClientRect().width / 50;

          if (image1) {
            image1.setAttribute(
              "style",
              `left: ${image1.getBoundingClientRect().left -
                container.getBoundingClientRect().left +
                move}px;`
            );
          }

          if (image2) {
            image2.setAttribute(
              "style",
              `left: ${image2.getBoundingClientRect().left -
                container.getBoundingClientRect().left +
                move}px;`
            );
          }
        }
      }
    },
    componentWillUnmount() {
      const { loadingInterval, setLoadingInterval } = this.props;

      if (loadingInterval) {
        clearInterval(loadingInterval);
        setLoadingInterval(null);
      }
    }
  })
)(ImageChange);
