import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";
import FontIcon from "react-md/lib/FontIcons";

import GameMenu from "../../components/views/GameMenu";

import { mouseActualize } from "../../actions/appActions";

const ViewGameFind = ({
  viewScreen,
  mouseClicked,
  mouseDown,
  mouseXPos,
  mouseYPos,
  mouseActualize,
  getNextUrlPart,
  screenFiles,
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
        onClick={() => {
          if (!mouseClicked) {
            mouseActualize({ mouseClicked: true, mouseDown: false });
          }
        }}
        onMouseMove={e =>
          !mouseClicked &&
          mouseActualize({
            mouseDown: true,
            mouseXPos: e.pageX,
            mouseYPos: e.pageY
          })
        }
        onMouseEnter={() =>
          mouseActualize({
            mouseDown: true
          })
        }
        onMouseLeave={() =>
          mouseActualize({
            mouseDown: false
          })
        }
      >
        {mouseDown &&
          !mouseClicked &&
          mouseXPos !== null &&
          mouseYPos !== null &&
          document.getElementById("view-game-find-game-wrap") &&
          mouseYPos + 18 <
            document
              .getElementById("view-game-find-game-wrap")
              .getBoundingClientRect().height +
              document
                .getElementById("view-game-find-game-wrap")
                .getBoundingClientRect().top && (
            <FontIcon
              className="mouse-icon"
              iconClassName="fa fa-flag"
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
        {viewScreen.showTip &&
          mouseClicked &&
          mouseXPos !== null &&
          mouseYPos !== null &&
          document.getElementById("view-game-find-game-wrap") && (
            <FontIcon
              className="mouse-icon"
              iconClassName="fa fa-flag"
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
              mouseDown: false
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
            mouseActualize({
              mouseClicked: false,
              mouseDown: false
            });
          }
        }}
      />
    </div>
  );
};

export default compose(
  withRouter,
  withState("doneButton", "setDoneButton", true),
  withState("resetButton", "setResetButton", true),
  withState("passButton", "setPassButton", true),
  connect(
    ({
      app: {
        timeout,
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
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles, mouseActualize } = this.props;
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
    }
  })
)(ViewGameFind);
