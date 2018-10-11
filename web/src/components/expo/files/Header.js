import React from "react";
import Button from "react-md/lib/Buttons/Button";

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
        onComplete={handleFile}
      >
        <Button flat label="Nahrát soubor">
          insert_drive_file
        </Button>
      </FileUploader>
    </div>
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
