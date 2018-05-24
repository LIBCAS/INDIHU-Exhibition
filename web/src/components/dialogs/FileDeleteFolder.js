import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import Dialog from "./DialogWrap";
import { deleteFolder, isFileInFolderUsed } from "../../actions/fileActions";

const FileDeleteFolder = ({ handleSubmit, data, activeExo, isFileInFolderUsed }) =>
  <Dialog
    title="Smazání složky"
    name="FileDeleteFolder"
    handleSubmit={handleSubmit}
    submitLabel="Smazat"
  >
    <p>
      Vybraná složka {data !== null && data !== undefined ? `"${data.name}" ` : ""}a všechen její
      obsah bude smazán.
    </p>
    {data &&
      activeExo &&
      isFileInFolderUsed(data.name) &&
      <p>
        <strong>Jeden ze souborů ve složce je používán!</strong>
      </p>}
  </Dialog>;

export default compose(
  connect(({ dialog: { data }, expo: { activeExo } }) => ({ data, activeExo }), {
    isFileInFolderUsed
  }),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      dispatch(deleteFolder(props.data.name));
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "fileDeleteFolder"
  })
)(FileDeleteFolder);
