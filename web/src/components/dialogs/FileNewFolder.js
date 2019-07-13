import React from "react";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";

import Dialog from "./DialogWrap";
import TextField from "../form/TextField";
import * as Validation from "../form/Validation";
import { addFolder } from "../../actions/fileActions";

const FileNewFolder = ({ handleSubmit }) => (
  <Dialog
    title="Nový adresář"
    name="FileNewFolder"
    handleSubmit={handleSubmit}
    submitLabel="Vytvořit"
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="expo-new-folder-textfield-name"
        name="name"
        label="Název adresáře"
        validate={[Validation.required]}
      />
    </form>
  </Dialog>
);

export default compose(
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      if (await dispatch(addFolder(formData.name))) dialog.closeDialog();
      else
        throw new SubmissionError({
          name: "Složka s tímto jménem již existuje."
        });
    }
  }),
  reduxForm({
    form: "fileNewFolder"
  })
)(FileNewFolder);
