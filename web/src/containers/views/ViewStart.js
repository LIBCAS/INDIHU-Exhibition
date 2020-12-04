import React from "react";
import { withRouter } from "react-router-dom";
import { compose, withState, lifecycle, defaultProps } from "recompose";
import { connect } from "react-redux";
import { map, get, noop } from "lodash";
import classNames from "classnames";
import FontIcon from "react-md/lib/FontIcons";

import { getFileById } from "../../actions/fileActions";
import { toggleInteractive } from "../../actions/expoActions/viewerActions";
import {
  giveMeExpoTime,
  hasValue,
  secondsToFormatedTime,
  openInNewTab,
  getDocumentIconName,
} from "../../utils";
import { animationType } from "../../enums/animationType";

const ViewStart = ({
  viewExpo,
  viewScreen,
  collapsed,
  handleCollapse,
  history,
  getFileById,
}) => {
  const audio = viewScreen.audio ? getFileById(viewScreen.audio) : null;
  const expoTime = giveMeExpoTime(viewExpo.structure.screens);
  return (
    <div>
      <div
        className={classNames("viewer-screen", { covered: collapsed })}
        onClick={() => handleCollapse(false)}
      >
        <div
          id="view-start-image-container"
          className={classNames("image-fullscreen-wrap", {
            slideUp:
              get(viewScreen, "animationType") === animationType.FROM_TOP,
            slideDown:
              get(viewScreen, "animationType") === animationType.FROM_BOTTOM,
            slideRight:
              get(viewScreen, "animationType") ===
              animationType.FROM_LEFT_TO_RIGHT,
            slideLeft:
              get(viewScreen, "animationType") ===
              animationType.FROM_RIGHT_TO_LEFT,
          })}
        />
      </div>
      <div className="viewer-start-menu">
        <div className={classNames("menu-tab left", { collapsed })}>
          <div className="flex-row main">
            <div className="flex-col title">
              <h2>{viewScreen.title}</h2>
              <p>{viewScreen.subTitle}</p>
            </div>
            <div
              className="flex-col menu"
              onClick={() => handleCollapse(!collapsed)}
            >
              <div className="flex-row icons">
                <FontIcon className="icon">menu</FontIcon>
                <FontIcon className="icon second-icon">volume_up</FontIcon>
              </div>
              <p className="text">
                {collapsed ? "Méně informací" : "Více informací"}
              </p>
            </div>
          </div>
          <div className="flex-col info">
            <div className="content">
              <div className="margin-bottom">
                {viewScreen.perex &&
                  (viewScreen.perex.indexOf("\n") !== -1
                    ? viewScreen.perex.split("\n").map((item, i) => (
                        <span key={i}>
                          {item}
                          <br />
                        </span>
                      ))
                    : viewScreen.perex)}
              </div>
              <div>
                <p>Kapitoly:</p>
                {map(
                  viewExpo.structure.screens,
                  (chapter, i) =>
                    chapter[0].type === "INTRO" && (
                      <p
                        key={i}
                        className="info-chapter"
                        onClick={() =>
                          history.push(`/view/${viewExpo.url}/${i}/0`)
                        }
                      >
                        {chapter[0].title || "(Nepojmenovaná kapitola)"}
                      </p>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={classNames("menu-tab right", { collapsed })}>
          <div
            className="main"
            onClick={() => history.push(`/view/${viewExpo.url}/0/0`)}
          >
            <h2>Projít si výstavu</h2>
            <p>
              Délka cca{" "}
              {viewScreen.expoTime && hasValue(viewScreen.expoTime)
                ? secondsToFormatedTime(viewScreen.expoTime, false)
                : expoTime}
            </p>
          </div>
          <div className="flex-col info">
            <div className="content">
              {map(viewScreen.collaborators, (c, i) => (
                <div className="part" key={`coll${i}`}>
                  <p className="bold">{c.role}</p>
                  {c.text.split("\n").map((t, i) => (
                    <p key={`text-${i}`}>{t}</p>
                  ))}
                </div>
              ))}
              <div className="flex-row">
                <div
                  className={classNames("full-width", { "half-width": audio })}
                >
                  <p>Dokumenty k výstavě:</p>
                  <div className="flex-col">
                    {map(viewScreen.documents, (d, i) => (
                      <div key={i}>
                        <a
                          id={`view-start-file-link-${i}`}
                          href={`/api/files/${d.fileId}`}
                          download={d.name}
                          hidden
                        >
                          a
                        </a>
                        <div
                          className={classNames("document", {
                            "document-link": d.fileId || d.url,
                          })}
                          onClick={() => {
                            if (d.name)
                              document
                                .getElementById(`view-start-file-link-${i}`)
                                .click();
                            else if (d.url) openInNewTab(d.url);
                          }}
                        >
                          <FontIcon className="icon">
                            {getDocumentIconName(d.name ? d.type : d.urlType)}
                          </FontIcon>
                          <p style={{ margin: 0 }}>{d.fileName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {audio && (
                  <div className="half-width">
                    <p>Audio verze výstavy:</p>
                    <a
                      id="view-start-audio-link"
                      href={`/api/files/${audio.fileId}`}
                      download={audio.name}
                      hidden
                    >
                      a
                    </a>
                    <div
                      className="document"
                      onClick={() =>
                        document.getElementById("view-start-audio-link").click()
                      }
                    >
                      <FontIcon className="icon">headset</FontIcon>
                      <p>{audio.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  defaultProps({ setStarted: noop }),
  withState("collapsed", "handleCollapse", false),
  connect(
    ({ expo: { viewExpo, viewScreen } }) => ({
      viewExpo,
      viewScreen,
    }),
    { getFileById, toggleInteractive }
  ),
  lifecycle({
    componentWillMount() {
      const { toggleInteractive, setStarted } = this.props;

      toggleInteractive(false);
      setStarted();
    },
    componentDidMount() {
      const { viewScreen, screenFiles } = this.props;

      if (screenFiles["image"]) {
        if (
          viewScreen.animationType === animationType.WITHOUT_AND_BLUR_BACKGROUND
        ) {
          const backgroundNode = screenFiles["image-reserved"];
          backgroundNode.className = "view-start-image-background";
          backgroundNode.setAttribute(
            "style",
            "position: static; min-width: 100%; min-height: 100%;"
          );
          document
            .getElementById("view-start-image-container")
            .appendChild(backgroundNode);
        }

        const newNode = screenFiles["image"];

        if (get(viewScreen, "animationType") === animationType.FROM_TOP) {
          newNode.className = "image-fullscreen animation-slideUp";
        } else if (
          get(viewScreen, "animationType") === animationType.FROM_BOTTOM
        ) {
          newNode.className = "image-fullscreen animation-slideDown";
        } else if (
          get(viewScreen, "animationType") === animationType.FROM_LEFT_TO_RIGHT
        ) {
          newNode.className = "image-fullscreen animation-slideRight";
        } else if (
          get(viewScreen, "animationType") === animationType.FROM_RIGHT_TO_LEFT
        ) {
          newNode.className = "image-fullscreen animation-slideLeft";
        } else if (
          get(viewScreen, "animationType") ===
          animationType.WITHOUT_AND_BLUR_BACKGROUND
        ) {
          newNode.className = "image-fullscreen with-blur";
        } else {
          newNode.className = "image-fullscreen";
        }

        document
          .getElementById("view-start-image-container")
          .appendChild(newNode);
      }
    },
  })
)(ViewStart);
