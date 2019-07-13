import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { compose, withState, withHandlers, lifecycle } from "recompose";
import FontIcon from "react-md/lib/FontIcons";

import GameMenu from "../../components/views/GameMenu";

import { mouseActualize } from "../../actions/appActions";

const ViewGameDraw = ({
  viewScreen,
  mouseClicked,
  mouseDown,
  mouseXPos,
  mouseYPos,
  mouseActualize,
  getNextUrlPart,
  screenFiles,
  ctx,
  paint,
  setPaint,
  setScrawl,
  addScrawl,
  doneButton,
  setDoneButton,
  resetButton,
  setResetButton,
  passButton,
  setPassButton
}) => {
  return (
    <div className="game">
      <div
        id="view-game-find-game-wrap"
        className={classNames("game-wrap", {
          "cursor-none": !mouseClicked
        })}
        onMouseDown={e => {
          setPaint(true);
          addScrawl(e.pageX, e.pageY);
        }}
        onMouseMove={e => {
          if (!mouseClicked)
            mouseActualize({
              mouseDown: true,
              mouseXPos: e.pageX,
              mouseYPos: e.pageY
            });
          if (paint) addScrawl(e.pageX, e.pageY, true);
        }}
        onMouseUp={() => setPaint(false)}
        onMouseEnter={() =>
          mouseActualize({
            mouseDown: true
          })
        }
        onMouseLeave={() => {
          mouseActualize({
            mouseDown: false
          });
          setPaint(false);
        }}
      >
        {/* CANVAS */}
        <canvas id="canvas" style={{ position: "absolute" }} />
        {/* MOUSE */}
        {mouseDown &&
          !mouseClicked &&
          mouseXPos !== null &&
          mouseYPos !== null &&
          mouseYPos + 18 <
            document
              .getElementById("view-game-find-game-wrap")
              .getBoundingClientRect().height +
              document
                .getElementById("view-game-find-game-wrap")
                .getBoundingClientRect().top && (
            <FontIcon
              className="mouse-icon"
              iconClassName="fa fa-pencil"
              style={{
                position: "absolute",
                left:
                  mouseXPos -
                  document
                    .getElementById("view-game-find-game-wrap")
                    .getBoundingClientRect().left,
                top:
                  mouseYPos -
                  document
                    .getElementById("view-game-find-game-wrap")
                    .getBoundingClientRect().top
              }}
            />
          )}
      </div>
      {/* FOOTER */}
      <GameMenu
        {...{
          doneButton,
          resetButton,
          passButton,
          task: viewScreen.task,
          getNextUrlPart,
          onClick: () => {
            mouseActualize({
              mouseClicked: true,
              mouseDown: false,
              mouseXPos: null,
              mouseYPos: null
            });
            if (document.getElementById("view-game-find-first-image")) {
              document.getElementById("view-game-find-first-image").outerHTML =
                "";
              delete document.getElementById("view-game-find-first-image");
            }
            if (viewScreen.image2) {
              const newNode = screenFiles["image2"];
              newNode.setAttribute(
                "style",
                `width: ${
                  viewScreen.image2OrigData.height >
                  viewScreen.image2OrigData.width
                    ? "auto"
                    : "100%"
                }; height: ${
                  viewScreen.image2OrigData.height >
                  viewScreen.image2OrigData.width
                    ? "100%"
                    : "auto"
                }; object-fit: contain;`
              );
              document
                .getElementById("view-game-find-game-wrap")
                .appendChild(newNode);
            }
            setResetButton(false);
            setDoneButton(false);
            setPassButton(false);
          },
          onReset: () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            setScrawl({ x: [], y: [], drag: [] });
          }
        }}
      />
    </div>
  );
};

export default compose(
  connect(
    ({
      app: {
        mouseInfo: { mouseClicked, mouseDown, mouseXPos, mouseYPos }
      },
      expo: { viewScreen }
    }) => ({
      mouseClicked,
      mouseDown,
      mouseXPos,
      mouseYPos,
      viewScreen
    }),
    {
      mouseActualize
    }
  ),
  withState("doneButton", "setDoneButton", true),
  withState("resetButton", "setResetButton", true),
  withState("passButton", "setPassButton", true),
  withState("ctx", "setCtx", null),
  withState("paint", "setPaint", false),
  withState("scrawl", "setScrawl", { x: [], y: [], drag: [] }),
  withHandlers({
    addScrawl: ({ ctx, scrawl, setScrawl }) => (x, y, dragging) => {
      const actScrawl = {
        x: [...scrawl.x, x],
        y: [...scrawl.y, y],
        drag: [...scrawl.drag, !!dragging]
      };

      setScrawl(actScrawl);

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.strokeStyle = "#3366cc";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;

      for (var i = 0; i < actScrawl.x.length; i++) {
        ctx.beginPath();
        if (actScrawl.drag[i] && i) {
          ctx.moveTo(actScrawl.x[i - 1] - 13, actScrawl.y[i - 1] - 27);
        } else {
          ctx.moveTo(actScrawl.x[i] - 13, actScrawl.y[i] - 27);
        }
        ctx.lineTo(actScrawl.x[i] - 12, actScrawl.y[i] - 27);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const { mouseActualize, viewScreen, screenFiles, setCtx } = this.props;
      mouseActualize({
        mouseClicked: false,
        mouseDown: false,
        mouseXPos: null,
        mouseYPos: null
      });

      if (viewScreen.image1) {
        const newNode = screenFiles["image1"];

        newNode.id = "view-game-find-first-image";
        newNode.setAttribute(
          "style",
          `width: ${
            viewScreen.image1OrigData.height > viewScreen.image1OrigData.width
              ? "auto"
              : "100%"
          }; height: ${
            viewScreen.image1OrigData.height > viewScreen.image1OrigData.width
              ? "100%"
              : "auto"
          }; object-fit: contain;`
        );
        document
          .getElementById("view-game-find-game-wrap")
          .appendChild(newNode);
      }
      // canvas
      const ctx = document.getElementById("canvas").getContext("2d");
      ctx.canvas.height = window.innerHeight - 110;
      ctx.canvas.width = window.innerWidth;
      setCtx(ctx);
    }
  })
)(ViewGameDraw);
