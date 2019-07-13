import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Card, CardText, FontIcon } from "react-md";

import { tabFile } from "../../../actions/fileActions";

const FileView = ({ activeFile, tabFile }) => (
  <Card
    className="files-view"
    onClick={() => {
      if (activeFile && !activeFile.content) {
        tabFile({ ...activeFile, show: true });
      }
    }}
  >
    <CardText className="files-view-text">
      {activeFile &&
        activeFile.show &&
        (/^image.*$/.test(activeFile.type) ? (
          <img
            src={`/api/files/${activeFile.fileId}`}
            alt="img"
            id="file-view-img"
            onLoad={() =>
              document.getElementById("file-view-img") &&
              tabFile({
                ...activeFile,
                width: document.getElementById("file-view-img").width,
                height: document.getElementById("file-view-img").height
              })
            }
          />
        ) : /^audio.*$/.test(activeFile.type) ? (
          <audio controls>
            <source
              src={`/api/files/${activeFile.fileId}`}
              type={activeFile.type}
            />
            Váš prohlížeč nepodporuje přehrávání audia.
          </audio>
        ) : /^video.*$/.test(activeFile.type) ? (
          <video controls>
            <source
              src={`/api/files/${activeFile.fileId}`}
              type={activeFile.type}
            />
            Váš prohlížeč nepodporuje přehrávání videa.
          </video>
        ) : (
          <i className="material-icons">insert_drive_file</i>
        ))}
      {activeFile && !activeFile.show && (
        <div className="placeholder">
          {/^image.*$/.test(activeFile.type) && activeFile.thumbnailId ? (
            <img src={`/api/files/${activeFile.thumbnailId}`} alt="thumbnail" />
          ) : (
            <i className="material-icons">
              {/^image.*$/.test(activeFile.type)
                ? "image"
                : /^audio.*$/.test(activeFile.type)
                ? "music_note"
                : /^video.*$/.test(activeFile.type)
                ? "movie"
                : "insert_drive_file"}
            </i>
          )}
          {/^audio.*$/.test(activeFile.type) ||
          /^video.*$/.test(activeFile.type) ||
          (/^image.*$/.test(activeFile.type) && !activeFile.thumbnailId) ? (
            <FontIcon {...{ className: "label" }}>play_arrow</FontIcon>
          ) : (
            <div />
          )}
        </div>
      )}
    </CardText>
  </Card>
);

export default compose(
  connect(
    null,
    { tabFile }
  )
)(FileView);
