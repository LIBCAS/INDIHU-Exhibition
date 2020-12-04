import React from "react";
import { map, isEmpty, filter, get } from "lodash";
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from "recompose";
import classNames from "classnames";

import InfopointIcon from "../../InfopointIcon";
import Scrollbar from "../../Scrollbar";

const CONTAINER_ID = "interactive-screen-photogallery-container";
const CONTAINER_INNER_ID = "interactive-screen-photogallery-container-inner";
const SCROLLBAR_ID = "interactive-screen-photogallery-scrollbar";

const Photogallery = ({
  images,
  showInfopoints,
  infopointsKey,
  updateInfopoints,
}) => {
  const scrollbar = document.getElementById(SCROLLBAR_ID);

  return (
    <div
      id={CONTAINER_ID}
      className="interactive-screen-photogallery-container"
    >
      <Scrollbar
        id={SCROLLBAR_ID}
        enableHorizontalMouseWheel={true}
        onMouseWheel={updateInfopoints}
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
          id={CONTAINER_INNER_ID}
          className="interactive-screen-photogallery-container-inner"
        />
        {images &&
          showInfopoints &&
          document.getElementById(CONTAINER_INNER_ID) &&
          map(images, (image, index) =>
            map(image.infopoints, (item, i) => (
              <div
                className="image-screen-infopoint"
                key={`${infopointsKey}${i}`}
              >
                <InfopointIcon
                  className={classNames("infopoint-icon custom-tooltip", {
                    show: item.alwaysVisible,
                  })}
                  style={{
                    position: "absolute",
                    top: document.getElementById(
                      `interactive-photogallery-image-infopoint-tooltip-hidden-${index}-${i}`
                    )
                      ? item.top *
                          (document
                            .getElementById(
                              `interactive-screen-photogallery-image-${index}`
                            )
                            .getBoundingClientRect().height /
                            images[index].imageOrigData.height) -
                        17 -
                        document
                          .getElementById(
                            `interactive-photogallery-image-infopoint-tooltip-hidden-${index}-${i}`
                          )
                          .getBoundingClientRect().height -
                        16 // 16px is scrollbar height
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
                        scrollbar.getBoundingClientRect().left +
                        scrollbar.scrollLeft +
                        item.left *
                          (document
                            .getElementById(
                              `interactive-screen-photogallery-image-${index}`
                            )
                            .getBoundingClientRect().height /
                            images[index].imageOrigData.height) -
                        document
                          .getElementById(
                            `interactive-photogallery-image-infopoint-tooltip-hidden-${index}-${i}`
                          )
                          .getBoundingClientRect().width /
                          2
                      : 0,
                  }}
                >
                  <div className="tooltip-text">{item.text}</div>
                </InfopointIcon>
              </div>
            ))
          )}
      </Scrollbar>
    </div>
  );
};

export default compose(
  withState("positionState", "setPositionState", 0),
  withState("showInfopoints", "setShowInfopoints", false),
  withState("infopointsKey", "setInfopointsKey", false),
  withProps(({ viewScreen }) => ({
    images: filter(viewScreen.images, (image) => get(image, "id")),
  })),
  withHandlers({
    updateInfopoints: ({ setInfopointsKey, infopointsKey }) => () =>
      setInfopointsKey(!infopointsKey),
  }),
  lifecycle({
    componentDidMount() {
      const { images, screenFiles, setShowInfopoints } = this.props;

      if (!isEmpty(images) && !isEmpty(screenFiles)) {
        for (let i = 0; i < images.length; i++) {
          const newNode = screenFiles[`images[${i}]`];

          if (newNode) {
            newNode.id = `interactive-screen-photogallery-image-${i}`;
            newNode.className = "interactive-screen-photogallery-image";

            document.getElementById(CONTAINER_INNER_ID).appendChild(newNode);
          }
        }

        setShowInfopoints(true);
      }
    },
  })
)(Photogallery);
