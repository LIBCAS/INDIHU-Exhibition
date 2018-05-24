import React from "react";
import Button from "react-md/lib/Buttons/Button";
// import FontIcon from "react-md/lib/FontIcons";
// import TextField from "react-md/lib/TextFields";
// import ListItem from "react-md/lib/Lists/ListItem";
// import MenuButton from "react-md/lib/Menus/MenuButton";

import { compose, withHandlers, withState } from "recompose";
import { connect } from "react-redux";
import { setDialog } from "../../../actions/dialogActions";
import { addFile } from "../../../actions/fileActions";

import FileUploader from "../../form/FileUploader";

const Header = ({ setDialog, handleFile, expoId, keyState }) =>
  <div className="flex-header">
    <div>
      <Button
        flat
        label="Nový adresář"
        onClick={() => setDialog("FileNewFolder")}
      >
        create_new_folder
      </Button>
      <FileUploader
        key={`file-uploader-${keyState ? "1" : "2"}`}
        url={`/api/file/?id=${expoId}`}
        accept="image/*, audio/*, video/*, application/pdf"
        onComplete={handleFile}
      >
        <Button flat label="Nahrát soubor">
          insert_drive_file
        </Button>
      </FileUploader>
    </div>
    {/* <div>
      <MenuButton id="expo-files-filter-sort-menu" icon buttonChildren="sort_by_alpha" position="tl">
        <ListItem primaryText="Název" />
        <ListItem primaryText="Datum vložení" />
        <ListItem primaryText="Velikost" />
      </MenuButton>
      <div className="search">
        <TextField id="expo-files-textfield-search" placeholder="Hledat" className="search-input" />
        <FontIcon className="search-icon">search</FontIcon>
      </div>
    </div> */}
  </div>;

export default compose(
  connect(
    ({ expo: { activeExpo }, file: { folder } }) => ({
      expoId: activeExpo.id,
      activeFolder: folder
    }),
    { setDialog, addFile }
  ),
  withState("keyState", "setKeyState", false),
  withHandlers({
    handleFile: ({
      addFile,
      activeFolder,
      onFileAdd,
      keyState,
      setKeyState
    }) => ({ status, response }) => {
      if (status === 200) addFile(response, activeFolder);
      if (onFileAdd) onFileAdd();
      setKeyState(!keyState);
    }
  })
)(Header);
