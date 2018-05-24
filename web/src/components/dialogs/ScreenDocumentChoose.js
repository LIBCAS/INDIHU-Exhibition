import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";

import Dialog from "./DialogWrap";
import FileManager from "../expo/files/FileManager";
import FileMeta from "../expo/files/FileMeta";
import FileView from "../expo/files/FileView";
import * as fileActions from "../../actions/fileActions";

const ScreenDocumentChoose = ({
  handleSubmit,
  dialogData,
  activeFile,
  activeFolder,
  activeExpo,
  tabFolder,
  tabFile
}) => {
  const onClose = () => {
    tabFolder(null);
  };
  return (
    <Dialog
      title="Vybrat soubor"
      name="ScreenDocumentChoose"
      submitLabel="Vybrat"
      handleSubmit={handleSubmit}
      onClose={onClose}
      className="large"
    >
      <div className="files-row">
        <div className="files-wrap--manager">
          <FileManager
            inDialog
            activeExpo={activeExpo}
            activeFile={activeFile}
            activeFolder={activeFolder}
            tabFolder={tabFolder}
            tabFile={tabFile}
            typeMatch={dialogData && dialogData.typeMatch}
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
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      if (props.activeFile) dialog.closeDialog();
      else
        dialog.addDialogData("ScreenDocumentChoose", {
          error: "*Vyber soubor"
        });
    }
  }),
  reduxForm({
    form: "screenDocumentChoose"
  })
)(ScreenDocumentChoose);
