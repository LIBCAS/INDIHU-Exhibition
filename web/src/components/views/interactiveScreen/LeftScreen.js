import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { isEmpty, map } from "lodash";
import FontIcon from "react-md/lib/FontIcons";

import { toggleInteractive } from "../../../actions/expoActions/viewerActions";

const LeftScreen = ({ viewScreen, toggleInteractive }) =>
  <div className="left">
    <div className="flex-col interactive-text">
      <div
        className={classNames("flex-col interactive-info", {
          "with-files": viewScreen.documents && !isEmpty(viewScreen.documents)
        })}
      >
        <p className="text">
          {viewScreen.text &&
            (viewScreen.text.indexOf("\n") !== -1
              ? viewScreen.text.split("\n").map((item, i) =>
                <span key={i}>
                  {item}
                  <br />
                </span>
              )
              : viewScreen.text)}
        </p>
        <div className="flex-row interactive-menu">
          <div className="menu-text">
            {viewScreen.title}
          </div>
          <FontIcon
            className="menu-icon"
            onClick={() => toggleInteractive(false)}
          >
            volume_up
        </FontIcon>
        </div>
      </div>
      {viewScreen.documents &&
        !isEmpty(viewScreen.documents) &&
        <div className="flex-col interactive-files">
          <div className="content">
            <p>Související dokumenty:</p>
            {map(viewScreen.documents, (d, i) =>
              <div key={i}>
                <a
                  id={`view-interactive-file-link-${i}`}
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
                        .getElementById(`view-interactive-file-link-${i}`)
                        .click();
                    else
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
        </div>}
    </div>
  </div>;

export default connect(null, { toggleInteractive })(LeftScreen);
