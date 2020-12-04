import React from "react";
import { compose, lifecycle } from "recompose";
import { isEmpty } from "lodash";

import Scrollbar from "../../Scrollbar";

const CONTAINER_ID = "interactive-screen-image-change-container";
const CONTAINER_INNER_ID = "interactive-screen-image-change-container-inner";
const SCROLLBAR_ID = "interactive-screen-image-change-scrollbar";

const ImageChange = () => {
  return (
    <div
      id={CONTAINER_ID}
      className="interactive-screen-image-change-container"
    >
      <Scrollbar id={SCROLLBAR_ID} enableHorizontalMouseWheel={true}>
        <div
          id={CONTAINER_INNER_ID}
          className="interactive-screen-image-change-container-inner"
        />
      </Scrollbar>
    </div>
  );
};

export default compose(
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles } = this.props;

      if (!isEmpty(screenFiles)) {
        if (viewScreen.image1) {
          const newNode = screenFiles["image1"];

          if (newNode) {
            newNode.id = "interactive-screen-image-change-image-1";
            newNode.className = "interactive-screen-image-change-image";

            document.getElementById(CONTAINER_INNER_ID).appendChild(newNode);
          }
        }

        if (viewScreen.image1) {
          const newNode = screenFiles["image2"];

          if (newNode) {
            newNode.id = "interactive-screen-image-change-image-2";
            newNode.className = "interactive-screen-image-change-image";

            document.getElementById(CONTAINER_INNER_ID).appendChild(newNode);
          }
        }
      }
    },
  })
)(ImageChange);
