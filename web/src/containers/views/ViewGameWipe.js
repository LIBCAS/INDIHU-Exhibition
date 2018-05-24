import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { compose, withState, withHandlers, lifecycle } from "recompose";
import FontIcon from "react-md/lib/FontIcons";

import GameMenu from "../../components/views/GameMenu";

import { mouseActualize } from "../../actions/appActions";

const ViewGameWipe = ({
  viewScreen,
  mouseClicked,
  mouseDown,
  mouseXPos,
  mouseYPos,
  mouseActualize,
  getNextUrlPart,
  ctx,
  paint,
  setPaint,
  setScrawl,
  addScrawl
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
          })}
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
                .getBoundingClientRect().top &&
          <FontIcon
            className="mouse-icon"
            iconClassName="fa fa-eraser"
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
          />}
      </div>
      {/* FOOTER */}
      <GameMenu
        {...{
          task: viewScreen.task,
          getNextUrlPart,
          onClick: () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            setScrawl({ x: [], y: [], drag: [] });
            mouseActualize({
              mouseClicked: true,
              mouseXPos: null,
              mouseYPos: null
            });
          }
        }}
      />
    </div>
  );
};

export default compose(
  connect(
    ({
      app: { mouseInfo: { mouseClicked, mouseDown, mouseXPos, mouseYPos } },
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

      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.strokeStyle = "#3366cc";
      ctx.lineJoin = "round";
      ctx.lineWidth = 80;

      for (var i = 0; i < actScrawl.x.length; i++) {
        ctx.beginPath();
        if (actScrawl.drag[i] && i) {
          ctx.moveTo(actScrawl.x[i - 1] - 15, actScrawl.y[i - 1] - 30);
        } else {
          ctx.moveTo(actScrawl.x[i] - 15, actScrawl.y[i] - 30);
        }
        ctx.lineTo(actScrawl.x[i] - 14, actScrawl.y[i] - 30);
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

      // canvas
      const ctx = document.getElementById("canvas").getContext("2d");
      const width = window.innerWidth;
      const height = window.innerHeight - 110;
      if (viewScreen.image1) {
        const img = new Image();
        img.src = screenFiles["image1"].src;
        img.onload = () => {
          ctx.canvas.width = width;
          ctx.canvas.height = height;
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(
            img,
            viewScreen.image1OrigData.height > viewScreen.image1OrigData.width
              ? (width -
                  height /
                    viewScreen.image1OrigData.height *
                    viewScreen.image1OrigData.width) /
                2
              : 0,
            viewScreen.image1OrigData.height > viewScreen.image1OrigData.width
              ? 0
              : (height -
                  width /
                    viewScreen.image1OrigData.width *
                    viewScreen.image1OrigData.height) /
                2,
            viewScreen.image1OrigData.height > viewScreen.image1OrigData.width
              ? height /
                viewScreen.image1OrigData.height *
                viewScreen.image1OrigData.width
              : width,
            viewScreen.image1OrigData.height > viewScreen.image1OrigData.width
              ? height
              : width /
                viewScreen.image1OrigData.width *
                viewScreen.image1OrigData.height
          );
        };
      } else {
        // there is no img, so fill with color
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.fillStyle = "#bbddfe";
        ctx.fillRect(0, 0, width, height);
      }
      setCtx(ctx);

      if (viewScreen.image2) {
        const newNode = screenFiles["image2"];
        newNode.setAttribute(
          "style",
          `width: ${viewScreen.image2OrigData.height >
          viewScreen.image2OrigData.width
            ? "auto"
            : "100%"}; height: ${viewScreen.image2OrigData.height >
          viewScreen.image2OrigData.width
            ? "100%"
            : "auto"}`
        );
        document
          .getElementById("view-game-find-game-wrap")
          .appendChild(newNode);
      }
    }
  })
)(ViewGameWipe);
