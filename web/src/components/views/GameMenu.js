import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  compose,
  lifecycle,
  withState,
  defaultProps,
  withProps,
  withHandlers,
} from "recompose";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";

import Progress from "./Progress";
import { setTimeoutId } from "../../actions/appActions";

const GameMenu = ({
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
  passButton,
  onDone,
  resultTime,
  progress,
  startProgress,
}) => {
  const onDoneAction = () => {
    if (!clicked) {
      setClicked(true);

      if (onDone) {
        onDone();
      } else {
        onClick();
      }

      if (getNextUrlPart) {
        const time = resultTime && resultTime > 0 ? resultTime * 1000 : 5000;
        startProgress(time);
        setTimeoutId(
          setTimeout(() => {
            history.push(getNextUrlPart());
          }, time)
        );
      }
    }
  };
  const onResetAction = () => onReset();
  const onPassAction = () => {
    if (!clicked) {
      setClicked(true);
      onClick();
      if (getNextUrlPart) {
        const time = 1000;
        startProgress(time);
        setTimeoutId(
          setTimeout(async () => {
            history.push(getNextUrlPart());
          }, time)
        );
      }
    }
  };
  const chapterButton = document.getElementById("viewer-title-menu-button");
  return (
    <div className="game-menu cursor">
      {clicked && (
        <div
          className="game-menu-progress"
          style={{
            right: chapterButton
              ? chapterButton.getBoundingClientRect().width + 10
              : 100,
          }}
        >
          <Progress percent={progress} />
        </div>
      )}
      <div className="menu-text">
        <div>{task}</div>
      </div>
      {doneButton && (
        <div
          className="menu-right-text cursor-pointer desktop-only"
          onClick={onDoneAction}
        >
          Hotovo
        </div>
      )}
      {resetButton && (
        <div
          className="menu-right-text cursor-pointer desktop-only"
          onClick={onResetAction}
        >
          Zahrát znovu
        </div>
      )}
      {passButton && (
        <div
          className="menu-right-text cursor-pointer desktop-only"
          onClick={onPassAction}
        >
          Přeskočit úkol
        </div>
      )}
      <MenuButton
        id="game-menu-mobile-menu"
        flat
        buttonChildren="more_vert"
        position="br"
        className="mobile-only mobile-menu"
      >
        {doneButton && <ListItem primaryText="Hotovo" onClick={onDoneAction} />}
        {resetButton && (
          <ListItem primaryText="Zahrát znovu" onClick={onResetAction} />
        )}
        {passButton && (
          <ListItem primaryText="Přeskočit úkol" onClick={onPassAction} />
        )}
      </MenuButton>
    </div>
  );
};

export default compose(
  withRouter,
  defaultProps({ passButton: true }),
  connect(
    ({ app: { timeout } }) => ({
      timeout,
    }),
    {
      setTimeoutId,
    }
  ),
  withState("clicked", "setClicked", false),
  withState("progress", "setProgress", 0),
  withState("progressIntervalId", "setProgressIntervalId", null),
  withHandlers({
    startProgress: ({ setProgress, setProgressIntervalId }) => (time) => {
      const start = new Date().getTime();

      setProgressIntervalId(
        setInterval(() => {
          const progress = ((new Date().getTime() - start) / time) * 100;
          setProgress(progress > 100 ? 100 : progress);
        }, 10)
      );
    },
  }),
  lifecycle({
    componentWillUnmount() {
      const { timeout, setTimeoutId, progressIntervalId } = this.props;
      if (timeout) {
        clearTimeout(timeout);
        setTimeoutId(null);
      }
      clearInterval(progressIntervalId);
    },
  }),
  withProps(({ clicked, task }) => ({
    task: clicked ? (
      <span style={{ fontSize: "1.5em" }} className="color-red text-bold">
        Správné řešení
      </span>
    ) : (
      task
    ),
  }))
)(GameMenu);
