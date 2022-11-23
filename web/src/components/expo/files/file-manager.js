import classNames from "classnames";
import { compose, withState } from "recompose";
import { Card, CardText, Button, FontIcon } from "react-md";
import { map, get } from "lodash";
import { connect } from "react-redux";

import { setDialog } from "../../../actions/dialog-actions";

const FileManager = ({
  activeFolder,
  activeFile,
  tabFolder,
  tabFile,
  setDialog,
  id,
  files,
  setSelectedFileAndFolder,
  expoId,
  dialog,
}) => (
  <Card id={id} className="files-manager">
    <CardText>
      {map(files, (folder, folderNum) => {
        let files = get(folder, "files", []);

        return (
          <div className="folder" key={`dir${folder.name}${folderNum}`}>
            {folder.name && (
              <div
                className="row"
                onClick={() =>
                  tabFolder(activeFolder === folder.name ? null : folder.name)
                }
              >
                <FontIcon>
                  {activeFolder === folder.name ? "folder_open" : "folder"}
                </FontIcon>
                <p>{`${folder.name} (${files.length})`}</p>
                <div className="row-actions">
                  <FontIcon
                    onClick={() =>
                      setDialog("FileRenameFolder", { name: folder.name })
                    }
                  >
                    mode_edit
                  </FontIcon>
                  <FontIcon
                    onClick={() =>
                      setDialog("FileDeleteFolder", { name: folder.name })
                    }
                  >
                    delete
                  </FontIcon>
                </div>
              </div>
            )}

            <div
              className={classNames({
                categorized: folder.name,
                open: activeFolder === folder.name,
              })}
            >
              {map(files, (file) => (
                <div
                  key={file.id}
                  className={classNames("row", {
                    active: get(activeFile, "id") === file.id,
                  })}
                  onClick={(state) => {
                    if (
                      !state &&
                      (!activeFile ||
                        (activeFile.id === file.id && !activeFile.show))
                    )
                      tabFile(null);
                    else if (
                      state &&
                      (!activeFile || activeFile.id !== file.id)
                    )
                      tabFile(file);
                  }}
                >
                  <FontIcon>insert_drive_file</FontIcon>
                  <p>{file.name}</p>
                  <div className="row-actions">
                    <Button
                      icon
                      onClick={() => {
                        const selectedFileAndFolder = {
                          file,
                          folder: get(folder, "name"),
                        };
                        setSelectedFileAndFolder(selectedFileAndFolder);
                        setDialog("FilesManagerMenu", {
                          file,
                          folder,
                          files,
                          imageEditor: {
                            expoId: expoId,
                            folder: get(selectedFileAndFolder, "folder"),
                            src: `/api/files/${get(
                              selectedFileAndFolder,
                              "file.fileId"
                            )}`,
                            type: get(selectedFileAndFolder, "file.type"),
                            onClose: () =>
                              dialog
                                ? setDialog(dialog.name, dialog.data)
                                : null,
                          },
                        });
                      }}
                    >
                      <FontIcon>more_horiz</FontIcon>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </CardText>
  </Card>
);

export default compose(
  connect(
    ({
      expo: {
        activeExpo: { id },
      },
    }) => ({ expoId: id }),
    { setDialog }
  ),
  withState("selectedFileAndFolder", "setSelectedFileAndFolder", null)
)(FileManager);
