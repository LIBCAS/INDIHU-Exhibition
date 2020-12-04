import React from "react";
import { connect } from "react-redux";
import {
  compose,
  withState,
  lifecycle,
  withHandlers,
  onlyUpdateForKeys,
} from "recompose";

import GameMenu from "../../components/views/GameMenu";

import { mouseActualize } from "../../actions/appActions";

const ViewGameSizing = ({
  viewScreen,
  mouseActualize,
  getNextUrlPart,
  changeImageSize,
  done,
  setDone,
  changeSize,
  screenFiles,
}) => (
  <div className="game">
    <div
      id="game-wrap"
      className="game-wrap"
      onMouseMove={(e) => {
        changeSize(e.pageX, e.pageY);
      }}
      onMouseUp={() => {
        document.body.style.cursor = "auto";
        mouseActualize({ mouseDown: false });
      }}
      onMouseLeave={() => {
        document.body.style.cursor = "auto";
        mouseActualize({ mouseDown: false });
      }}
    >
      <div id="game-half1" className="game-half game-half-image" />
      <div
        id="game-half2"
        className="game-half game-half-resize cursor-nw-resize"
        onMouseDown={() => {
          document.body.style.cursor = "nw-resize";
          mouseActualize({ mouseDown: true });
        }}
      />
    </div>
    <GameMenu
      {...{
        doneButton: !done,
        passButton: !done,
        resetButton: !done,
        task: viewScreen.task,
        resultTime: viewScreen.resultTime,
        getNextUrlPart,
        onClick: () => {
          mouseActualize({
            mouseDown: false,
            mouseYPos: null,
          });
          document.getElementById("game-half1").outerHTML = "";
          delete document.getElementById("game-half1");
          document.getElementById("game-half2").outerHTML = "";
          delete document.getElementById("game-half2");
          if (viewScreen.image3 && screenFiles["image3"]) {
            const newNode = screenFiles["image3"];
            document.getElementById("game-wrap").appendChild(newNode);
          }
          setDone(true);
        },
        onReset: () => changeImageSize(50),
      }}
    />
  </div>
);

export default compose(
  connect(
    ({
      app: {
        mouseInfo: { mouseDown, mouseXPos, mouseYPos },
      },
      expo: { viewScreen },
    }) => ({
      mouseDown,
      mouseXPos,
      mouseYPos,
      viewScreen,
    }),
    {
      mouseActualize,
    }
  ),
  withState("done", "setDone", false),
  withState("imageSize", "setImageSize", 50),
  withHandlers({
    changeImageSize: ({ viewScreen, setImageSize }) => (imageSize) => {
      const element = document.getElementById("view-game-sizing-image-resize");
      if (element) {
        element.style.width =
          viewScreen.image2OrigData.height > viewScreen.image2OrigData.width
            ? "auto"
            : `${imageSize}%`;
        element.style.height =
          viewScreen.image2OrigData.height > viewScreen.image2OrigData.width
            ? `${imageSize}%`
            : "auto";
        setImageSize(imageSize);
      }
    },
  }),
  withHandlers({
    changeSize: ({
      changeImageSize,
      imageSize,
      mouseXPos,
      mouseYPos,
      mouseDown,
      mouseActualize,
    }) => (x, y) => {
      if (mouseDown) {
        document.body.style.cursor = "nw-resize";
        const newImageSize =
          mouseXPos - x + mouseYPos - y > 0
            ? imageSize < 100
              ? imageSize + 1
              : imageSize
            : imageSize > 0
            ? imageSize - 1
            : imageSize;
        changeImageSize(newImageSize);
        mouseActualize({ mouseXPos: x, mouseYPos: y });
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      const {
        viewScreen,
        screenFiles,
        mouseActualize,
        changeImageSize,
        imageSize,
      } = this.props;
      mouseActualize({ mouseDown: false, mouseYPos: false });

      if (viewScreen.image1 && screenFiles["image1"]) {
        const imageNode1 = screenFiles["image1"];

        imageNode1.setAttribute("style", `width: 100%; height: 100%;`);
        document.getElementById("game-half1").appendChild(imageNode1);
      }

      if (viewScreen.image2 && screenFiles["image2"]) {
        const imageNode2 = screenFiles["image2"];

        imageNode2.id = "view-game-sizing-image-resize";
        imageNode2.draggable = "false";
        imageNode2.style.position = "absolute";
        imageNode2.style.bottom = 0;
        imageNode2.style.right = 0;
        imageNode2.style.width = "100%";
        imageNode2.style.height = "100%";
        document.getElementById("game-half2").appendChild(imageNode2);

        changeImageSize(imageSize);
      }
    },
  }),
  onlyUpdateForKeys(["done"])
)(ViewGameSizing);
