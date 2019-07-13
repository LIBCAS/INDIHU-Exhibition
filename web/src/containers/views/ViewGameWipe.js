import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { compose, withState, withHandlers, lifecycle } from "recompose";
import FontIcon from "react-md/lib/FontIcons";

import GameMenu from "../../components/views/GameMenu";

import { mouseActualize, showLoader } from "../../actions/appActions";

const ViewGameWipe = ({
  viewScreen,
  mouseClicked,
  mouseActualize,
  getNextUrlPart,
  ctx,
  paint,
  setPaint,
  setScrawl,
  addScrawl,
  done,
  setDone,
  init
}) => {
  return (
    <div className="game">
      <div
        id="view-game-wipe-game-wrap"
        className={classNames("game-wrap", {
          "cursor-none": !mouseClicked
        })}
        onMouseDown={e => {
          setPaint(true);
          addScrawl(e.pageX, e.pageY);
        }}
        onMouseMove={e => {
          if (!mouseClicked) {
            const moveIcon = document.getElementById(
              "view-game-wipe-move-icon"
            );
            moveIcon.style.display =
              e.pageY + 18 <
              document
                .getElementById("view-game-wipe-game-wrap")
                .getBoundingClientRect().height +
                document
                  .getElementById("view-game-wipe-game-wrap")
                  .getBoundingClientRect().top
                ? "block"
                : "none";
            moveIcon.style.position = "absolute";
            moveIcon.style.left = `${e.pageX -
              document
                .getElementById("view-game-wipe-game-wrap")
                .getBoundingClientRect().left}px`;
            moveIcon.style.top = `${e.pageY -
              document
                .getElementById("view-game-wipe-game-wrap")
                .getBoundingClientRect().top}px`;
          }
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
        <FontIcon
          id="view-game-wipe-move-icon"
          className="mouse-icon"
          iconClassName="fa fa-eraser"
        />
      </div>
      {/* FOOTER */}
      <GameMenu
        {...{
          doneButton: !done,
          passButton: !done,
          resetButton: !done,
          task: viewScreen.task,
          getNextUrlPart,
          onClick: () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            setScrawl({ x: [], y: [], drag: [] });
            const moveIcon = document.getElementById(
              "view-game-wipe-move-icon"
            );
            moveIcon.style.display = "none";
            mouseActualize({
              mouseClicked: true
            });
            setDone(true);
          },
          onReset: () => {
            if (document.getElementById("view-game-wipe-game-wrap-image2")) {
              document.getElementById(
                "view-game-wipe-game-wrap-image2"
              ).outerHTML = "";
              delete document.getElementById("view-game-wipe-game-wrap-image2");
            }
            init(ctx);
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
        mouseInfo: { mouseClicked, mouseDown }
      },
      expo: { viewScreen }
    }) => ({
      mouseClicked,
      mouseDown,
      viewScreen
    }),
    {
      mouseActualize,
      showLoader
    }
  ),
  withState("done", "setDone", false),
  withState("ctx", "setCtx", null),
  withState("paint", "setPaint", false),
  withState("ctxImg", "setCtxImg", null),
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
    },
    init: ({ screenFiles, viewScreen, showLoader, setScrawl }) => ctx => {
      showLoader(true);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      setScrawl({ x: [], y: [], drag: [] });
      const wrapper = document.getElementById("view-game-wipe-game-wrap");
      const width = wrapper.getBoundingClientRect().width;
      const height = wrapper.getBoundingClientRect().height;
      const img = new Image();
      img.src = screenFiles["image1"].src;
      const realWidth = viewScreen.image1OrigData.width;
      const realHeight = viewScreen.image1OrigData.height;
      const imageWidth =
        realWidth / width > realHeight / height
          ? width
          : (height / realHeight) * realWidth;
      const imageHeight =
        realHeight / height > realWidth / width
          ? height
          : (width / realWidth) * realHeight;
      img.onload = () => {
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(
          img,
          imageWidth >= width ? 0 : (width - imageWidth) / 2,
          imageHeight >= height ? 0 : (height - imageHeight) / 2,
          imageWidth,
          imageHeight
        );

        if (viewScreen.image2) {
          const newNode = screenFiles["image2"];
          newNode.id = "view-game-wipe-game-wrap-image2";
          newNode.setAttribute(
            "style",
            `width: 100%; height: 100%; object-fit: contain;`
          );
          document
            .getElementById("view-game-wipe-game-wrap")
            .appendChild(newNode);
        }

        showLoader(false);
      };
      img.onerror = () => showLoader(false);
    }
  }),
  lifecycle({
    componentDidMount() {
      const { mouseActualize, viewScreen, setCtx, init } = this.props;
      mouseActualize({
        mouseClicked: false,
        mouseDown: false,
        mouseXPos: null,
        mouseYPos: null
      });

      // canvas
      const ctx = document.getElementById("canvas").getContext("2d");
      const wrapper = document.getElementById("view-game-wipe-game-wrap");
      const width = wrapper.getBoundingClientRect().width;
      const height = wrapper.getBoundingClientRect().height;
      if (viewScreen.image1) {
        init(ctx);
      } else {
        // there is no img, so fill with color
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.fillStyle = "#bbddfe";
        ctx.fillRect(0, 0, width, height);
      }
      setCtx(ctx);
    }
  })
)(ViewGameWipe);
