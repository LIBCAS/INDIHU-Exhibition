import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers, withState, withProps } from "recompose";
import { get } from "lodash";

import Dialog from "./DialogWrap";
import Header from "../expo/files/Header";
import FileManager from "../expo/files/FileManager";
import FileMeta from "../expo/files/FileMeta";
import FileView from "../expo/files/FileView";
import * as fileActions from "../../actions/fileActions";
import { keyShortcutsEnhancer, sortFilterFiles } from "../expo/files/utils";

const ScreenFileChoose = ({
  handleSubmit,
  dialogData,
  activeFile,
  activeFolder,
  files,
  tabFolder,
  tabFile,
  setKeyState,
  keyState,
  setSort,
  sort,
  order,
  setOrder,
  containerID
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
      <Header
        onFileAdd={() => setKeyState(!keyState)}
        sort={sort}
        setSort={setSort}
        order={order}
        setOrder={setOrder}
        accept={get(dialogData, "accept")}
      />
      <div className="files-row">
        <div className="files-wrap--manager">
          <FileManager
            id={containerID}
            sort={sort}
            setSort={setSort}
            files={files}
            activeFile={activeFile}
            activeFolder={activeFolder}
            tabFolder={tabFolder}
            tabFile={tabFile}
            typeMatch={dialogData && dialogData.typeMatch}
            key={`files-file-manager-state-${keyState}`}
          />
          {dialogData && dialogData.error && <p>{dialogData.error}</p>}
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
    ({ expo: { activeExpo }, file: { folder, file }, dialog: { name } }) => ({
      activeExpo,
      activeFolder: folder,
      activeFile: file,
      dialogName: name
    }),
    { ...fileActions }
  ),
  withState("keyState", "setKeyState", true),
  withState("sort", "setSort", "CREATED"),
  withState("order", "setOrder", "ASC"),
  withProps(({ dialogName, activeExpo, sort, order, dialogData }) => ({
    containerID: "screen-file-choose-files-manager",
    shortcutsEnabled: dialogName === "ScreenFileChoose",
    files: sortFilterFiles(
      activeExpo,
      sort,
      order,
      get(dialogData, "typeMatch")
    )
  })),
  keyShortcutsEnhancer,
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
