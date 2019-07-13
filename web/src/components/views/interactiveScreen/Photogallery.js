import React from "react";
import { map, isEmpty, filter, get } from "lodash";
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps
} from "recompose";
import classNames from "classnames";

import InfopointIcon from "../../InfopointIcon";

const scrollBarHeight = 14;
const scrollBarBorderRadius = 8;

const getPositionLeft = index => {
  let sum = 0;

  for (let i = 0; i < index; i++) {
    const image = document.getElementById(
      `interactive-screen-photogallery-image-${i}`
    );
    sum += image
      ? i > 0
        ? image.getBoundingClientRect().width + 5
        : image.getBoundingClientRect().width
      : 0;
  }

  return sum;
};

const Photogallery = ({
  images,
  showScrollbar,
  getImagesWidth,
  updateMouseData
}) => {
  const imagesWidth = getImagesWidth();

  return (
    <div
      id="interactive-screen-photogallery-container"
      className="interactive-screen-photogallery-container"
    >
      {map(images, (image, index) =>
        map(image.infopoints, (item, i) => (
          <InfopointIcon
            key={i}
            className={classNames(
              "infopoint-icon custom-tooltip hidden-custom-tooltip"
            )}
          >
            <div
              id={`interactive-photogallery-image-infopoint-tooltip-hidden-${index}-${i}`}
              className="tooltip-text"
            >
              {item.text}
            </div>
          </InfopointIcon>
        ))
      )}
      <div
        id="interactive-screen-photogallery-container-inner"
        className="interactive-screen-photogallery-container-inner"
        style={{ height: showScrollbar && `calc(100% - ${scrollBarHeight}px)` }}
      />
      {images &&
        document.getElementById(
          "interactive-screen-photogallery-container-inner"
        ) &&
        map(images, (image, index) =>
          map(image.infopoints, (item, i) => (
            <div className="image-screen-infopoint" key={i}>
              <InfopointIcon
                className={classNames("infopoint-icon custom-tooltip", {
                  show: item.alwaysVisible
                })}
                style={{
                  position: "absolute",
                  top: document.getElementById(
                    `interactive-photogallery-image-infopoint-tooltip-hidden-${index}-${i}`
                  )
                    ? item.top *
                        (document
                          .getElementById(
                            "interactive-screen-photogallery-container-inner"
                          )
                          .getBoundingClientRect().height /
                          images[index].imageOrigData.height) -
                      17 -
                      document
                        .getElementById(
                          `interactive-photogallery-image-infopoint-tooltip-hidden-${index}-${i}`
                        )
                        .getBoundingClientRect().height
                    : 0,
                  left: document.getElementById(
                    `interactive-photogallery-image-infopoint-tooltip-hidden-${index}-${i}`
                  )
                    ? (document.getElementById(
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
                            "interactive-screen-photogallery-container-inner"
                          )
                          .getBoundingClientRect().height /
                          images[index].imageOrigData.height) -
                      17 -
                      document
                        .getElementById(
                          `interactive-photogallery-image-infopoint-tooltip-hidden-${index}-${i}`
                        )
                        .getBoundingClientRect().width /
                        2
                    : 0
                }}
              >
                <div className="tooltip-text">{item.text}</div>
              </InfopointIcon>
            </div>
          ))
        )}
      {showScrollbar && (
        <div
          id="interactive-screen-photogallery-container-scrollbar"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: scrollBarHeight,
            backgroundColor: "#FFFFFF",
            borderRadius: scrollBarBorderRadius
          }}
        >
          {imagesWidth && (
            <div
              id="interactive-screen-photogallery-container-scrollbar-inner"
              onMouseDown={({ clientX }) => {
                const x =
                  clientX -
                  document
                    .getElementById(
                      "interactive-screen-photogallery-container-scrollbar"
                    )
                    .getBoundingClientRect().left;
                updateMouseData({
                  down: true,
                  x
                });
              }}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: 0,
                left:
                  -(
                    document
                      .getElementById("interactive-screen-photogallery-image-0")
                      .getBoundingClientRect().left -
                    document
                      .getElementById(
                        "interactive-screen-photogallery-container-inner"
                      )
                      .getBoundingClientRect().left
                  ) *
                  (document
                    .getElementById(
                      "interactive-screen-photogallery-container-inner"
                    )
                    .getBoundingClientRect().width /
                    imagesWidth),
                width:
                  (document
                    .getElementById(
                      "interactive-screen-photogallery-container-inner"
                    )
                    .getBoundingClientRect().width /
                    imagesWidth) *
                  document
                    .getElementById(
                      "interactive-screen-photogallery-container-inner"
                    )
                    .getBoundingClientRect().width,
                height: "100%",
                backgroundColor: "#444444",
                borderRadius: scrollBarBorderRadius,
                border: "1px solid #FFFFFF"
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default compose(
  withState("updateTimeout", "setUpdateTimeout", null),
  withState("positionState", "setPositionState", 0),
  withState("showScrollbar", "setShowscrollbar", false),
  withState("mouseData", "setMouseData", {
    x: 0,
    down: false
  }),
  withProps(({ viewScreen }) => ({
    images: filter(viewScreen.images, image => get(image, "id"))
  })),
  withHandlers({
    getImagesWidth: ({ images }) => () => {
      let sum = 0;

      for (let i = 0; i < images.length; i++) {
        const image = document.getElementById(
          `interactive-screen-photogallery-image-${i}`
        );

        if (image) {
          sum += image.getBoundingClientRect().width;
        }
      }

      return sum;
    }
  }),
  withHandlers({
    updateShowScrollbar: ({ getImagesWidth, setShowscrollbar }) => () => {
      const container = document.getElementById(
        "interactive-screen-photogallery-container-inner"
      );
      const scrollbar = document.getElementById(
        "interactive-screen-photogallery-container-scrollbar"
      );

      let showScrollbar = true;

      if (container && scrollbar) {
        const containerHeight = container.getBoundingClientRect().height;
        showScrollbar =
          ((containerHeight + scrollbar.getBoundingClientRect().height) /
            containerHeight) *
            getImagesWidth() >
          container.getBoundingClientRect().width;
      } else if (container) {
        showScrollbar =
          getImagesWidth() > container.getBoundingClientRect().width;
      }

      setShowscrollbar(showScrollbar);
    },
    updateMouseData: ({ mouseData, setMouseData }) => patch =>
      setMouseData({ ...mouseData, ...patch })
  }),
  withHandlers({
    moveByScrollbar: ({ images, updateMouseData, getImagesWidth }) => (
      x,
      newX
    ) => {
      const scrollbarInner = document
        .getElementById(
          "interactive-screen-photogallery-container-scrollbar-inner"
        )
        .getBoundingClientRect();

      const scrollbar = document
        .getElementById("interactive-screen-photogallery-container-scrollbar")
        .getBoundingClientRect();

      const containerInner = document
        .getElementById("interactive-screen-photogallery-container-inner")
        .getBoundingClientRect();

      const move =
        newX -
          x +
          (scrollbarInner.left - scrollbar.left) +
          scrollbarInner.width >
        scrollbar.width
          ? scrollbar.width -
            scrollbarInner.width -
            (scrollbarInner.left - scrollbar.left)
          : newX - x + (scrollbarInner.left - scrollbar.left) < 0
          ? -(scrollbarInner.left - scrollbar.left)
          : newX - x;

      const imagesWidth = getImagesWidth();

      for (let i = 0; i < images.length; i++) {
        const image = document.getElementById(
          `interactive-screen-photogallery-image-${i}`
        );

        image.setAttribute(
          "style",
          `left: ${image.getBoundingClientRect().left -
            containerInner.left -
            move * (imagesWidth / containerInner.width)}px;`
        );
      }

      updateMouseData({ x: newX });
    }
  }),
  withHandlers({
    updateImages: ({ images, updateShowScrollbar }) => () => {
      for (let i = 0; i < images.length; i++) {
        const image = document.getElementById(
          `interactive-screen-photogallery-image-${i}`
        );

        image.setAttribute("style", `left: ${getPositionLeft(i)}px;`);
      }

      updateShowScrollbar();
    },
    onMouseMove: ({ mouseData, moveByScrollbar }) => ({ clientX }) => {
      if (mouseData.down) {
        const x =
          clientX -
          document
            .getElementById(
              "interactive-screen-photogallery-container-scrollbar"
            )
            .getBoundingClientRect().left;
        moveByScrollbar(mouseData.x, x);
      }
    },
    endScrollbarMove: ({ updateMouseData }) => () =>
      updateMouseData({ down: false })
  }),
  lifecycle({
    componentWillMount() {
      const { endScrollbarMove, onMouseMove, updateImages } = this.props;

      document.addEventListener("mouseup", endScrollbarMove);
      document.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", updateImages);
    },
    componentDidMount() {
      const {
        images,
        screenFiles,
        updateShowScrollbar,
        setUpdateTimeout,
        updateImages
      } = this.props;

      if (!isEmpty(images) && !isEmpty(screenFiles)) {
        for (let i = 0; i < images.length; i++) {
          const newNode = screenFiles[`images[${i}]`];

          if (newNode) {
            newNode.id = `interactive-screen-photogallery-image-${i}`;
            newNode.className = "interactive-screen-photogallery-image";

            newNode.setAttribute("style", `left: ${getPositionLeft(i)}px;`);

            document
              .getElementById("interactive-screen-photogallery-container-inner")
              .appendChild(newNode);
          }
        }

        updateShowScrollbar();

        setUpdateTimeout(setTimeout(updateImages, 500));
      }
    },
    componentWillReceiveProps({ scrolling }) {
      const { images, setScrolling, loadingInterval, moveForward } = this.props;

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
      const {
        endScrollbarMove,
        onMouseMove,
        updateImages,
        updateTimeout
      } = this.props;

      document.removeEventListener("mouseup", endScrollbarMove);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", updateImages);

      clearTimeout(updateTimeout);
    }
  })
)(Photogallery);
