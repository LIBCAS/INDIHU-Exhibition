import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers, withState } from "recompose";

import Dialog from "./DialogWrap";
import Header from "../expo/files/Header";
import FileManager from "../expo/files/FileManager";
import FileMeta from "../expo/files/FileMeta";
import FileView from "../expo/files/FileView";
import * as fileActions from "../../actions/fileActions";

const ScreenFileChoose = ({
  handleSubmit,
  dialogData,
  activeFile,
  activeFolder,
  activeExpo,
  tabFolder,
  tabFile,
  setKeyState,
  keyState
}) => {
  const onClose = () => {
    tabFolder(null);
  };
  return (
    <Dialog
      title="Vybrat soubor"
      name="ScreenFileChoose"
      submitLabel="Vybrat"
      handleSubmit={handleSubmit}
      onClose={onClose}
      className="large"
    >
      <Header onFileAdd={() => setKeyState(!keyState)} />
      <div className="files-row">
        <div className="files-wrap--manager">
          <FileManager
            activeExpo={activeExpo}
            activeFile={activeFile}
            activeFolder={activeFolder}
            tabFolder={tabFolder}
            tabFile={tabFile}
            typeMatch={dialogData && dialogData.typeMatch}
            key={`files-file-manager-state${keyState ? "1" : "2"}`}
          />
          {dialogData &&
            dialogData.error &&
            <p>
              {dialogData.error}
            </p>}
        </div>
        <div className="files-col">
          <div className="files-wrap--view">
            <FileView activeFile={activeFile} activeFolder={activeFolder} />
          </div>
          <div className="files-wrap--meta">
            <FileMeta activeFile={activeFile} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default compose(
  connect(
    ({ expo: { activeExpo }, file: { folder, file } }) => ({
      activeExpo,
      activeFolder: folder,
      activeFile: file
    }),
    { ...fileActions }
  ),
  withState("keyState", "setKeyState", true),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      const { activeFile, dialogData } = props;
      const { onChoose } = dialogData;

      if (activeFile) {
        onChoose(activeFile);
        props.tabFolder(null);
        dialog.closeDialog();
      } else
        dialog.addDialogData("ScreenFileChoose", {
          error: "*Vyber soubor"
        });
    }
  }),
  reduxForm({
    form: "screenFileChoose"
  })
)(ScreenFileChoose);
