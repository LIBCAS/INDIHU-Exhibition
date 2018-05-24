import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { map } from "lodash";
import classNames from "classnames";
import FontIcon from "react-md/lib/FontIcons";
import {
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  FacebookShareButton,
  TwitterShareButton,
  GooglePlusShareButton
} from 'react-share';

import { getFileById } from "../../actions/fileActions";
import { screenUrl } from "../../enums/screenType";

const ViewFinish = ({ viewScreen, viewExpo, getFileById, history }) => {
  const audio = viewScreen.audio ? getFileById(viewScreen.audio) : null;
  const fullUrl = `http://inqooltest.libj.cas.cz/view/${viewExpo.url}`;

  return (
    <div className="viewer-screen viewer-finish">
      <div className="viewer-finish-container">
        <div id="view-finish-image-container" className="image-container" />
        <div className="left">
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
            <div className="icon-container" onClick={() => null}>
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
            <GooglePlusShareButton className="icon-social" url={fullUrl}>
              <GooglePlusIcon size={50} round={true} />
            </GooglePlusShareButton>
          </div>
        </div>
        <div className="right">
          <div className="content">
            {map(viewScreen.collaborators, (c, i) =>
              <div className="part" key={`coll${i}`}>
                <p>
                  {c.role}
                </p>
                {c.text.split("\n").map((t, i) =>
                  <p key={`text-${i}`}>
                    {t}
                  </p>
                )}
              </div>
            )}
            <div className="flex-row">
              <div className={classNames({ "half-width": audio })}>
                <p>Dokumenty k výstavě:</p>
                <div className="flex-col">
                  {map(viewScreen.documents, (d, i) =>
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
                        className="document"
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
                        {d.name
                          ? <FontIcon className="icon">
                            {/^image.*$/.test(d.type)
                              ? "image"
                              : /^audio.*$/.test(d.type)
                                ? "music_note"
                                : /^video.*$/.test(d.type)
                                  ? "movie"
                                  : "insert_drive_file"}
                          </FontIcon>
                          : <FontIcon className="icon">
                            {/^image.*$/.test(d.urlType)
                              ? "image"
                              : /^audio.*$/.test(d.urlType)
                                ? "music_note"
                                : /^video.*$/.test(d.urlType)
                                  ? "movie"
                                  : "insert_drive_file"}
                          </FontIcon>}
                        <p>
                          {d.fileName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {audio &&
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
                      document.getElementById("view-finish-audio-link").click()}
                  >
                    <FontIcon className="icon">headset</FontIcon>
                    <p>
                      {audio.name}
                    </p>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div >
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
          `width: ${viewScreen.imageOrigData.height >
            viewScreen.imageOrigData.width
            ? "auto"
            : "100%"}; height: ${viewScreen.imageOrigData.height >
              viewScreen.imageOrigData.width
              ? "100%"
              : "auto"};`
        );

        document.getElementById("view-finish-image-container").prepend(newNode);
      }
    }
  })
)(ViewFinish);
