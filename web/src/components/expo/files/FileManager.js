import React from "react";
import classNames from "classnames";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import FontIcon from "react-md/lib/FontIcons";
import { map, get } from "lodash";

import { connect } from "react-redux";
import { setDialog } from "../../../actions/dialogActions";
import { changeRadioState } from "../../../actions/appActions";

const FileManager = ({
  activeExpo,
  activeFolder,
  activeFile,
  tabFolder,
  tabFile,
  setDialog,
  changeRadioState,
  typeMatch
}) =>
  <Card className="files-manager">
    <CardText>
      {map(get(activeExpo, "structure.files"), (folder, folderNum) =>
        <div className="folder" key={`dir${folderNum}`}>
          {folder.name &&
            <div
              className="row"
              onClick={() =>
                tabFolder(activeFolder === folder.name ? null : folder.name)}
            >
              <FontIcon>
                {activeFolder === folder.name ? "folder_open" : "folder"}
              </FontIcon>
              <p>
                {folder.name}
              </p>
              {activeFolder === folder.name &&
                <div className="row-actions">
                  <FontIcon
                    onClick={() =>
                      setDialog("FileRenameFolder", { name: folder.name })}
                  >
                    mode_edit
                  </FontIcon>
                  <FontIcon
                    onClick={() =>
                      setDialog("FileDeleteFolder", { name: folder.name })}
                  >
                    delete
                  </FontIcon>
                </div>}
            </div>}

          <div
            className={classNames({
              categorized: folder.name,
              open: activeFolder === folder.name
            })}
          >
            {map(
              folder.files,
              (file, fileNum) =>
                file &&
                (!typeMatch || typeMatch.test(file.type)) &&
                <div
                  key={file.id}
                  className={classNames("row", {
                    active: get(activeFile, "id") === file.id
                  })}
                  onClick={state => {
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
                  <p>
                    {file.name}
                  </p>
                  {get(activeFile, "id") === file.id &&
                    <div className="row-actions">
                      <MenuButton
                        icon
                        id="file-manager-row-actions"
                        buttonChildren="more_horiz"
                        position="tr"
                      >
                        <ListItem
                          primaryText="Přejmenovat"
                          rightIcon={<FontIcon>mode_edit</FontIcon>}
                          onClick={() =>
                            setDialog("FileRename", {
                              id: file.id,
                              name: file.name
                            })}
                        />
                        <ListItem
                          primaryText="Přesunout"
                          rightIcon={<FontIcon>content_copy</FontIcon>}
                          disabled={
                            get(activeExpo, "structure.files").length <= 1
                          }
                          onClick={() => {
                            if (folder.name)
                              changeRadioState(`FOLDER_${folder.name}`);
                            else changeRadioState("ROOT");
                            setDialog("FileMove", {
                              file,
                              folder: folder.name
                            });
                          }}
                        />
                        <ListItem
                          primaryText="Smazat"
                          rightIcon={<FontIcon>delete</FontIcon>}
                          onClick={() =>
                            setDialog("FileDelete", {
                              id: file.id,
                              name: file.name
                            })}
                        />
                      </MenuButton>
                    </div>}
                </div>
            )}
          </div>
        </div>
      )}
    </CardText>
  </Card>;

export default connect(null, { setDialog, changeRadioState })(FileManager);
