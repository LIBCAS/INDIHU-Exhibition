import React from "react";
import { connect } from "react-redux";
import { compose, withState, lifecycle } from "recompose";

import GameMenu from "../../components/views/GameMenu";

import { mouseActualize } from "../../actions/appActions";

const ViewGameSizing = ({
  viewScreen,
  mouseDown,
  mouseYPos,
  mouseActualize,
  getNextUrlPart,
  screenFiles,
  imageSize,
  setImageSize
}) =>
  <div className="game">
    <div id="game-wrap" className="game-wrap">
      <div id="game-half1" className="game-half" />
      <div
        id="game-half2"
        className="game-half game-half-resize cursor-move"
        onMouseMove={e => {
          if (mouseDown) {
            mouseActualize({ mouseYPos: e.pageY });
            setImageSize(
              e.pageY < mouseYPos
                ? imageSize < 100 ? imageSize + 1 : imageSize
                : imageSize > 0 ? imageSize - 1 : imageSize
            );
          }
        }}
        onMouseDown={() => {
          mouseActualize({ mouseDown: true });
        }}
        onMouseUp={() => {
          mouseActualize({ mouseDown: false });
        }}
      >
        <img
          alt=""
          src={screenFiles["image2"].src}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width:
              viewScreen.image2OrigData.height > viewScreen.image2OrigData.width
                ? "auto"
                : `${imageSize}%`,
            height:
              viewScreen.image2OrigData.height > viewScreen.image2OrigData.width
                ? `${imageSize}%`
                : "auto"
          }}
          draggable="false"
        />
      </div>
    </div>
    <GameMenu
      {...{
        doneButton: true,
        task: viewScreen.task,
        getNextUrlPart,
        onClick: () => {
          mouseActualize({
            mouseDown: false,
            mouseYPos: null
          });
          document.getElementById("game-half1").outerHTML = "";
          delete document.getElementById("game-half1");
          document.getElementById("game-half2").outerHTML = "";
          delete document.getElementById("game-half2");
          if (viewScreen.image3) {
            const newNode = screenFiles["image3"];
            document.getElementById("game-wrap").appendChild(newNode);
          }
        }
      }}
    />
  </div>;

export default compose(
  connect(
    ({
      app: { mouseInfo: { mouseDown, mouseYPos } },
      expo: { viewScreen }
    }) => ({
      mouseDown,
      mouseYPos,
      viewScreen
    }),
    {
      mouseActualize
    }
  ),
  withState("imageSize", "setImageSize", 50),
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles, mouseActualize } = this.props;
      mouseActualize({ mouseDown: false, mouseYPos: false });

      if (viewScreen.image1) {
        const imageNode1 = screenFiles["image1"];

        imageNode1.setAttribute(
          "style",
          `width: ${viewScreen.image1OrigData.height >
          viewScreen.image1OrigData.width
            ? "auto"
            : "100%"}; height: ${viewScreen.image1OrigData.height >
          viewScreen.image1OrigData.width
            ? "100%"
            : "auto"}`
        );
        document.getElementById("game-half1").appendChild(imageNode1);
      }
    }
  })
)(ViewGameSizing);
