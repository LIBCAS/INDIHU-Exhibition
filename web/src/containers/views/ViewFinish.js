import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";
import { map } from "lodash";
import classNames from "classnames";
import { TextField, Button, FontIcon, Snackbar } from "react-md";
import {
  FacebookIcon,
  TwitterIcon,
  FacebookShareButton,
  TwitterShareButton
} from "react-share";
import ReactTooltip from "react-tooltip";
import CopyToClipboard from "react-copy-to-clipboard";

import { getFileById } from "../../actions/fileActions";
import { screenUrl } from "../../enums/screenType";

const ViewFinish = ({
  viewScreen,
  viewExpo,
  getFileById,
  history,
  collapsed,
  setCollapsed,
  isCopied,
  setIsCopied
}) => {
  const audio = viewScreen.audio ? getFileById(viewScreen.audio) : null;
  const fullUrl = `${window.location.origin}/view/${viewExpo.url}`;

  return (
    <div className="viewer-screen viewer-finish">
      <div className="viewer-finish-container">
        <div id="view-finish-image-container" className="image-container" />
        <div className={classNames("left", { full: collapsed })}>
          <div className="left-row">
            <div
              className="icon-container"
              onClick={() => history.push(`/view/${viewExpo.url}/start`)}
            >
              <FontIcon className="icon">refresh</FontIcon>Spustit znovu
            </div>
            {/* <div className="icon-container" onClick={() => null}>
              <FontIcon className="icon">file_upload</FontIcon>Sdílet výstavu
            </div> */}
            <div
              className="icon-container"
              onClick={() => setCollapsed(!collapsed)}
            >
              <FontIcon className="icon">crop_square</FontIcon>Bibliografie
            </div>
          </div>
          <div className="left-row">
            <FacebookShareButton className="icon-social" url={fullUrl}>
              <FacebookIcon size={50} round={true} />
            </FacebookShareButton>
            <TwitterShareButton className="icon-social" url={fullUrl}>
              <TwitterIcon size={50} round={true} />
            </TwitterShareButton>
          </div>
          <div className="left-row">
            <div className="share-link">
              <p>Získejte odkaz na výstavu:</p>
              <div className="bottom-row">
                <TextField disabled={true} value={fullUrl} />
                <CopyToClipboard text={fullUrl}>
                  <Button
                    icon
                    className="copybutton"
                    onClick={() => setIsCopied(true)}
                    data-tip="Získat odkaz na výstavu"
                    data-for="view-finish-share-link-tooltip"
                  >
                    link
                  </Button>
                </CopyToClipboard>
              </div>
              <ReactTooltip
                type="dark"
                effect="solid"
                id="view-finish-share-link-tooltip"
                // className="help-icon-react-tooltip"
              />
            </div>
          </div>
        </div>
        <div className={classNames("right", { collapsed })}>
          <div className="content">
            {map(viewScreen.collaborators, (c, i) => (
              <div className="part" key={`coll${i}`}>
                <p>{c.role}</p>
                {c.text.split("\n").map((t, i) => (
                  <p key={`text-${i}`}>{t}</p>
                ))}
              </div>
            ))}
            <div className="flex-row">
              <div className={classNames({ "half-width": audio })}>
                <p>Dokumenty k výstavě:</p>
                <div className="flex-col">
                  {map(viewScreen.documents, (d, i) => (
                    <div key={i}>
                      <a
                        id={`view-finish-file-link-${i}`}
                        href={`/api/files/${d.fileId}`}
                        download={d.name}
                        hidden
                      >
                        a
                      </a>
                      <div
                        className={classNames("document", {
                          "document-link": d.fileId || d.url
                        })}
                        onClick={() => {
                          if (d.name)
                            document
                              .getElementById(`view-finish-file-link-${i}`)
                              .click();
                          else if (d.url)
                            window
                              .open(
                                /^(http:\/\/|https:\/\/).*$/.test(d.url)
                                  ? d.url
                                  : `http://${d.url}`,
                                "_blank"
                              )
                              .focus();
                        }}
                      >
                        {d.name ? (
                          <FontIcon className="icon">
                            {/^image.*$/.test(d.type)
                              ? "image"
                              : /^audio.*$/.test(d.type)
                              ? "music_note"
                              : /^video.*$/.test(d.type)
                              ? "movie"
                              : "insert_drive_file"}
                          </FontIcon>
                        ) : (
                          <FontIcon className="icon">
                            {/^image.*$/.test(d.urlType)
                              ? "image"
                              : /^audio.*$/.test(d.urlType)
                              ? "music_note"
                              : /^video.*$/.test(d.urlType)
                              ? "movie"
                              : /^WEB$/.test(d.urlType)
                              ? "web"
                              : "insert_drive_file"}
                          </FontIcon>
                        )}
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
                    id="view-finish-audio-link"
                    href={`/api/files/${audio.fileId}`}
                    download={audio.name}
                    hidden
                  >
                    a
                  </a>
                  <div
                    className="document"
                    onClick={() =>
                      document.getElementById("view-finish-audio-link").click()
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
      <Snackbar
        id="snackbar"
        toasts={isCopied ? [{ text: "Odkaz zkopírován" }] : undefined}
        autohide={true}
        onDismiss={() => setIsCopied(false)}
        className="color-background-white color-black flex-row-normal flex-centered"
      />
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({ expo: { viewScreen, viewExpo } }) => ({
      viewScreen,
      viewExpo
    }),
    { getFileById }
  ),
  withState("collapsed", "setCollapsed", true),
  withState("isCopied", "setIsCopied", false),
  lifecycle({
    componentWillMount() {
      const { handleScreen } = this.props;
      handleScreen({ section: screenUrl.FINISH });
    },
    componentDidMount() {
      const { screenFiles, viewScreen } = this.props;

      if (screenFiles["image"]) {
        const newNode = screenFiles["image"];

        newNode.setAttribute(
          "style",
          `width: ${
            viewScreen.imageOrigData.height > viewScreen.imageOrigData.width
              ? "auto"
              : "100%"
          }; height: ${
            viewScreen.imageOrigData.height > viewScreen.imageOrigData.width
              ? "100%"
              : "auto"
          };`
        );

        document
          .getElementById("view-finish-image-container")
          .appendChild(newNode);
      }
    }
  })
)(ViewFinish);
