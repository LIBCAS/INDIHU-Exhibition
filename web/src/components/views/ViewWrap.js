import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import { get, map, filter, isEqual } from "lodash";
import { Button, FontIcon } from "react-md";

import { setDialog } from "../../actions/dialogActions";
import { turnSoundOff } from "../../actions/expoActions/viewerActions";
import { screenType } from "../../enums/screenType";
import Progress from "./Progress";

const ViewWrap = ({
  institution,
  title,
  children,
  setDialog,
  viewExpo,
  history,
  soundIsTurnedOff,
  turnSoundOff,
  viewScreen,
  progress,
  showProgress
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
        {showProgress() && <Progress percent={progress} />}
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
            {soundIsTurnedOff ? "volume_off" : "volume_up"}
          </FontIcon>}
      </div>
    </div>
    {children}
  </div>;

export default compose(
  withRouter,
  connect(
    ({ expo: { viewExpo, viewScreen, soundIsTurnedOff, preloadedFiles } }) => ({
      viewExpo,
      viewScreen,
      soundIsTurnedOff,
      preloadedFiles
    }),
    { setDialog, turnSoundOff }
  ),
  withState("url", "setUrl", null),
  withState("viewScreenState", "setViewScreenState", null),
  withState("viewInteractiveState", "setViewInteractiveState", false),
  withState("progress", "setProgress", 0),
  withState("progressIntervalId", "setProgressIntervalId", null),
  withHandlers({
    showProgress: ({
      viewInteractive,
      viewScreen,
      expoViewer,
      preloadedFiles
    }) => () =>
      !viewInteractive &&
      viewScreen &&
      viewScreen.type !== screenType.START &&
      viewScreen.type !== screenType.FINISH &&
      viewScreen.type !== screenType.GAME_DRAW &&
      viewScreen.type !== screenType.GAME_FIND &&
      viewScreen.type !== screenType.GAME_MOVE &&
      viewScreen.type !== screenType.GAME_OPTIONS &&
      viewScreen.type !== screenType.GAME_SIZING &&
      viewScreen.type !== screenType.GAME_WIPE &&
      (expoViewer ||
        viewScreen.type !== screenType.VIDEO ||
        !isNaN(get(preloadedFiles, `video.duration`)))
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const {
        viewScreen,
        viewScreenState,
        url,
        viewInteractiveState,
        viewInteractive,
        preloadedFiles,
        location
      } = nextProps;
      const {
        setUrl,
        setProgress,
        progressIntervalId,
        setProgressIntervalId,
        setViewInteractiveState,
        showProgress,
        expoViewer,
        setViewScreenState
      } = this.props;

      if (
        (viewScreen &&
          ((get(viewScreen, "id") &&
            get(viewScreenState, "id") !== get(viewScreen, "id")) ||
            !isEqual(viewScreen, viewScreenState)) &&
          url !== location.pathname) ||
        viewInteractiveState !== viewInteractive
      ) {
        setViewScreenState(viewScreen);
        setUrl(location.pathname);
        setViewInteractiveState(viewInteractive);
        setProgress(0);

        clearInterval(progressIntervalId);

        if (showProgress()) {
          const start = new Date().getTime();
          const screenNumbers = window.location.pathname.match(/(\d+)\/(\d+)$/);
          const section = Number(get(screenNumbers, "[1]"));
          const screen = Number(get(screenNumbers, "[2]"));
          const time =
            get(
              viewScreen,
              "time",
              viewScreen.type === screenType.VIDEO
                ? expoViewer
                  ? !isNaN(section) &&
                    !isNaN(screen) &&
                    !isNaN(
                      get(
                        preloadedFiles,
                        `[${section}][${screen}].video.duration`
                      )
                    )
                    ? get(
                        preloadedFiles,
                        `[${section}][${screen}].video.duration`
                      )
                    : 20
                  : !isNaN(get(preloadedFiles, `video.duration`))
                    ? get(preloadedFiles, `video.duration`)
                    : 20
                : 20
            ) * 1000;
          setProgressIntervalId(
            setInterval(() => {
              const progress = (new Date().getTime() - start) / time * 100;
              setProgress(progress > 100 ? 100 : progress);
            }, 10)
          );
        }
      }
    }
  })
)(ViewWrap);
