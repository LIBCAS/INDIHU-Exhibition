import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import Dialog from "./DialogWrap";
import { deleteFile, tabFile, isFileUsed } from "../../actions/fileActions";

const FileDelete = ({ handleSubmit, data, activeExo, isFileUsed }) =>
  <Dialog
    title="Smazání souboru"
    name="FileDelete"
    handleSubmit={handleSubmit}
    submitLabel="Smazat"
  >
    <p>
      Vybraný soubor {data !== null && data !== undefined ? `"${data.name}" ` : ""}bude smazán.
    </p>
    {data && activeExo &&
      isFileUsed(data.id) &&
      <p>
        <strong>Soubor je používán!</strong>
      </p>}
  </Dialog>;

export default compose(
  connect(({ dialog: { data }, expo: { activeExo } }) => ({ data, activeExo }), { isFileUsed }),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      if (await dispatch(deleteFile(props.data.id))) {
        dispatch(tabFile(null));
      }
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "fileDelete"
  })
)(FileDelete);
