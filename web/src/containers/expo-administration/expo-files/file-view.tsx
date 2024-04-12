import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";

import { Card, CardText, FontIcon } from "react-md";
import { File as IndihuFile } from "models";
import { tabFile } from "actions/file-actions";

type FileViewProps = {
  activeFile: IndihuFile | null;
  activeFolder: any;
};

const FileView = ({ activeFile }: FileViewProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Card
      className="files-view"
      onClick={() => {
        if (activeFile && !activeFile.content) {
          dispatch(tabFile({ ...activeFile, show: true }));
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
              onLoad={() => {
                const fileViewImgEl = document.getElementById(
                  "file-view-img"
                ) as HTMLImageElement | null;
                if (fileViewImgEl) {
                  dispatch(
                    tabFile({
                      ...activeFile,
                      width: fileViewImgEl.width,
                      height: fileViewImgEl.height,
                    })
                  );
                }
              }}
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
              <img
                src={`/api/files/${activeFile.thumbnailId}`}
                alt="thumbnail"
              />
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
};

export default FileView;
