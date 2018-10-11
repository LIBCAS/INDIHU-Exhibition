import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { get, map, filter } from "lodash";
import { Button, FontIcon } from "react-md";

import { setDialog } from "../../actions/dialogActions";
import { turnSoundOff } from "../../actions/expoActions/viewerActions";

const ViewWrap = ({
  institution,
  title,
  children,
  setDialog,
  viewExpo,
  history,
  soundIsTurnedOff,
  turnSoundOff,
  viewScreen
}) =>
  <div className="viewer">
    <div className="viewer-title">
      <div className="viewer-title-institution">
        <span>
          {institution}
        </span>
      </div>
      <div
        className="viewer-title-name"
        onClick={() => history.push(`/view/${get(viewExpo, "url")}/start`)}
      >
        <span>
          {title}
        </span>
      </div>
      <div className="viewer-title-menu">
        <Button
          flat
          id="viewer-title-menu-button"
          className="viewer-title-menu-button"
          label="Kapitoly"
          onClick={() =>
            setDialog("ViewWrapChapters", {
              title: get(viewExpo, "title", ""),
              url: get(viewExpo, "url", ""),
              chapters: filter(
                map(get(viewExpo, "structure.screens", []), (screens, i) => ({
                  chapter: get(screens, "[0]"),
                  chapterNumber: i
                })),
                item => get(item, "chapter.type") === "INTRO"
              )
            })}
        />
        {get(viewScreen, "type") &&
          get(viewScreen, "type") !== "START" &&
          get(viewScreen, "type") !== "FINISH" &&
          <FontIcon
            className="view-wrap-icon margin-horizontal-very-small"
            onClick={() => turnSoundOff(!soundIsTurnedOff)}
            title={soundIsTurnedOff ? "Zapnout zvuk" : "Vypnout zvuk"}
          >
            {soundIsTurnedOff ? "volume_up" : "volume_off"}
          </FontIcon>}
      </div>
    </div>
    {children}
  </div>;

export default compose(
  withRouter,
  connect(
    ({ expo: { viewExpo, viewScreen, soundIsTurnedOff } }) => ({
      viewExpo,
      viewScreen,
      soundIsTurnedOff
    }),
    { setDialog, turnSoundOff }
  )
)(ViewWrap);
