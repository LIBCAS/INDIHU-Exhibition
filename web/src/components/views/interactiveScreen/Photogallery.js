import React from "react";
import { map, isEmpty, filter, get } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import ReactTooltip from "react-tooltip";
import { compose, lifecycle, withState, withHandlers } from "recompose";

const getPositionLeft = index => {
  let sum = 0;

  for (let i = 0; i < index; i++) {
    const image = document.getElementById(
      `interactive-screen-photogallery-image-${i}`
    );
    sum += image ? image.getBoundingClientRect().width : 0;
  }

  return sum ? sum + 5 : 0;
};

const Photogallery = ({ viewScreen, loadingInterval }) => {
  return (
    <div
      id="interactive-screen-photogallery-container"
      className="interactive-screen-photogallery-container"
    >
      <div
        id="interactive-screen-photogallery-container-inner"
        className="interactive-screen-photogallery-container-inner"
      />
      {viewScreen.images &&
        document.getElementById("interactive-screen-photogallery-container") &&
        !loadingInterval &&
        map(viewScreen.images, (image, index) =>
          map(image.infopoints, (item, i) =>
            <div className="image-screen-infopoint" key={i}>
              <FontIcon
                className="infopoint-icon"
                style={{
                  position: "absolute",
                  top:
                    item.top *
                      (document
                        .getElementById(
                          "interactive-screen-photogallery-container"
                        )
                        .getBoundingClientRect().height /
                        viewScreen.images[index].imageOrigData.height) -
                    12,
                  left:
                    (document.getElementById(
                      `interactive-screen-photogallery-image-${index}`
                    )
                      ? document
                          .getElementById(
                            `interactive-screen-photogallery-image-${index}`
                          )
                          .getBoundingClientRect().left
                      : 0) -
                    document
                      .getElementById(
                        "interactive-screen-photogallery-container"
                      )
                      .getBoundingClientRect().left +
                    item.left *
                      (document
                        .getElementById(
                          "interactive-screen-photogallery-container"
                        )
                        .getBoundingClientRect().height /
                        viewScreen.images[index].imageOrigData.height) -
                    12
                }}
                data-tip={item.text}
              >
                help_outline
              </FontIcon>
              <ReactTooltip
                className="infopoint-tooltip"
                type="dark"
                effect="solid"
              />
            </div>
          )
        )}
    </div>
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

      const images = filter(viewScreen.images, image => get(image, "id"));

      for (let i = 0; i < images.length; i++) {
        const image = document.getElementById(
          `interactive-screen-photogallery-image-${i}`
        );

        if (image) {
          image.setAttribute("style", `left: ${getPositionLeft(i)}px;`);
        }

        if (!image || image.getBoundingClientRect().width === 0) {
          flag = false;
        }
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
      } = this.props;

      const images = filter(viewScreen.images, image => get(image, "id"));

      if (!isEmpty(images) && !isEmpty(screenFiles)) {
        for (let i = 0; i < images.length; i++) {
          const newNode = screenFiles[`images[${i}]`];

          if (newNode) {
            newNode.id = `interactive-screen-photogallery-image-${i}`;
            newNode.className = "interactive-screen-photogallery-image";

            newNode.setAttribute("style", `left: ${getPositionLeft(i)}px;`);

            document
              .getElementById("interactive-screen-photogallery-container-inner")
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

      const images = filter(viewScreen.images, image => get(image, "id"));

      if (!isEmpty(images) && scrolling && !loadingInterval) {
        setScrolling(false);

        const firstImage = document.getElementById(
          "interactive-screen-photogallery-image-0"
        );

        const lastImage = document.getElementById(
          `interactive-screen-photogallery-image-${images.length - 1}`
        );

        const container = document.getElementById(
          "interactive-screen-photogallery-container"
        );

        if (
          container &&
          lastImage &&
          ((!moveForward &&
            lastImage.getBoundingClientRect().right >
              container.getBoundingClientRect().right) ||
            (moveForward &&
              firstImage.getBoundingClientRect().left <
                container.getBoundingClientRect().left))
        ) {
          for (let i = 0; i < images.length; i++) {
            const image = document.getElementById(
              `interactive-screen-photogallery-image-${i}`
            );

            const move = moveForward
              ? container.getBoundingClientRect().width / 50
              : -container.getBoundingClientRect().width / 50;

            image.setAttribute(
              "style",
              `left: ${image.getBoundingClientRect().left -
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
)(Photogallery);
