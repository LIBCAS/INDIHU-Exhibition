import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./DialogWrap";
import TextField from "../form/TextField";
import * as Validation from "../form/Validation";
import { renameFile, tabFile } from "../../actions/fileActions";

const FileRename = ({ handleSubmit }) => (
  <Dialog
    title="Přejmenovat soubor"
    name="FileRename"
    handleSubmit={handleSubmit}
    submitLabel="Přejmenovat"
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="filerename-textfield-name"
        label="Nový název souboru"
        name="name"
        validate={[Validation.required]}
      />
    </form>
  </Dialog>
);

export default compose(
  connect(
    ({ dialog: { data } }) => ({ data, initialValues: { ...data } }),
    null
  ),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      dispatch(renameFile(props.data.id, formData.name));
      dispatch(tabFile(null));
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "fileRename",
    enableReinitialize: true
  })
)(FileRename);
