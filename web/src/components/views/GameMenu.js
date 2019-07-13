import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  compose,
  lifecycle,
  withState,
  defaultProps,
  withProps
} from "recompose";

import { setTimeoutId } from "../../actions/appActions";

const ViewGameMove = ({
  setTimeoutId,
  getNextUrlPart,
  history,
  task,
  onClick,
  doneButton,
  resetButton,
  onReset,
  clicked,
  setClicked,
  passButton
}) => (
  <div className="game-menu cursor">
    <div className="menu-text">{task}</div>
    {doneButton && (
      <div
        className="menu-right-text cursor-pointer"
        onClick={() => {
          if (!clicked) {
            setClicked(true);
            onClick();
            if (getNextUrlPart) {
              setTimeoutId(
                setTimeout(() => {
                  history.push(getNextUrlPart());
                }, 5000)
              );
            }
          }
        }}
      >
        Hotovo
      </div>
    )}
    {resetButton && (
      <div className="menu-right-text cursor-pointer" onClick={() => onReset()}>
        Zahrát znovu
      </div>
    )}
    {passButton && (
      <div
        className="menu-right-text cursor-pointer"
        onClick={() => {
          if (!clicked) {
            setClicked(true);
            onClick();
            if (getNextUrlPart) {
              setTimeoutId(
                setTimeout(async () => {
                  history.push(getNextUrlPart());
                }, 1000)
              );
            }
          }
        }}
      >
        Přeskočit úkol
      </div>
    )}
  </div>
);

export default compose(
  withRouter,
  defaultProps({ passButton: true }),
  connect(
    ({ app: { timeout } }) => ({
      timeout
    }),
    {
      setTimeoutId
    }
  ),
  withState("clicked", "setClicked", false),
  lifecycle({
    componentWillUnmount() {
      const { timeout, setTimeoutId } = this.props;
      if (timeout) {
        clearTimeout(timeout);
        setTimeoutId(null);
      }
    }
  }),
  withProps(({ clicked, task }) => ({
    task: clicked ? (
      <span>
        <span style={{ fontSize: "1.5em" }} className="color-red text-bold">
          Výsledek{" "}
        </span>{" "}
        (za chvíli dojde k přechodu na další obrazovku)
      </span>
    ) : (
      task
    )
  }))
)(ViewGameMove);
