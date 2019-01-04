import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";

import GameMenu from "../../components/views/GameMenu";

import { mouseActualize } from "../../actions/appActions";

const compDimensions = (container, image) => {
  if (container.width > container.height && image.width > image.height)
    return "width: 100%; height: auto;";
  else return "width: auto; height: 100%;";
};

const ViewGameMove = ({
  viewScreen,
  mouseActualize,
  screenFiles,
  mouseDown,
  correlationX,
  correlationY,
  getNextUrlPart,
  doneButton,
  setDoneButton,
  passButton,
  setPassButton
}) =>
  <div className="game">
    <div id="game-wrap" className="game-wrap">
      <div
        id="game-move-container"
        className="game-move-container"
        onMouseMove={e => {
          if (mouseDown) {
            const container = document
              .getElementById("game-move-container")
              .getBoundingClientRect();
            document
              .getElementById("game-move-object")
              .setAttribute(
                "style",
                `left: ${e.pageX +
                  correlationX -
                  container.left}px; top: ${e.pageY +
                  correlationY -
                  container.top}px;`
              );
          }
        }}
        onMouseDown={e => {
          const object = document
            .getElementById("game-move-object")
            .getBoundingClientRect();

          if (
            e.pageX >= object.left &&
            e.pageX <= object.right &&
            e.pageY >= object.top &&
            e.pageY <= object.bottom
          ) {
            mouseActualize({
              mouseDown: true,
              correlationX: object.left - e.pageX,
              correlationY: object.top - e.pageY
            });
          }
        }}
        onMouseUp={() => {
          mouseActualize({ mouseDown: false });
        }}
      />
    </div>
    <GameMenu
      {...{
        doneButton,
        passButton,
        task: viewScreen.task,
        getNextUrlPart,
        onClick: () => {
          document.getElementById("game-move-image").outerHTML = "";
          delete document.getElementById("game-move-image");
          document.getElementById("game-move-object").outerHTML = "";
          delete document.getElementById("game-move-object");
          if (viewScreen.image2) {
            const imageNode2 = screenFiles["image2"];
            const container = document
              .getElementById("game-move-container")
              .getBoundingClientRect();
            imageNode2.id = "game-move-image";
            imageNode2.setAttribute(
              "style",
              `top: 50%; left: 50%; transform: translate(-50%, -50%); object-fit: contain;
              ${compDimensions(container, viewScreen.image1OrigData)}`
            );
            document
              .getElementById("game-move-container")
              .appendChild(imageNode2);
          }
          setDoneButton(false);
          setPassButton(false);
        }
      }}
    />
  </div>;

export default compose(
  connect(
    ({
      app: { mouseInfo: { mouseDown, correlationX, correlationY } },
      expo: { viewScreen, viewerFiles }
    }) => ({
      mouseDown,
      correlationX,
      correlationY,
      viewScreen,
      viewerFiles
    }),
    {
      mouseActualize
    }
  ),
  withState("doneButton", "setDoneButton", true),
  withState("passButton", "setPassButton", true),
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles } = this.props;
      mouseActualize({
        mouseDown: false
      });

      const container = document
        .getElementById("game-move-container")
        .getBoundingClientRect();

      if (viewScreen.image1) {
        const imageNode1 = screenFiles["image1"];

        imageNode1.id = "game-move-image";
        imageNode1.setAttribute(
          "style",
          `top: 50%; left: 50%; transform: translate(-50%, -50%); object-fit: contain;
          ${compDimensions(container, viewScreen.image1OrigData)}`
        );
        document.getElementById("game-move-container").appendChild(imageNode1);
      }

      if (viewScreen.object) {
        const objectNode = screenFiles["object"];

        objectNode.id = "game-move-object";
        objectNode.className = "cursor-move";
        objectNode.setAttribute(
          "style",
          "top: 50%; left: 50%; transform: translate(-50%, -50%); object-fit: contain;"
        );
        document.getElementById("game-move-container").appendChild(objectNode);
      }
    }
  })
)(ViewGameMove);
