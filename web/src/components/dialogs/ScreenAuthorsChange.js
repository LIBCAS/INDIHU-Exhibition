import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { compose, withHandlers } from "recompose";

import Dialog from "./DialogWrap";
import TextField from "../form/TextField";
import * as Validation from "../form/Validation";

import { changeScreenCollaborators } from "../../actions/expoActions";

const ScreenAuthorsChange = ({ handleSubmit }) =>
  <Dialog
    title="Změnit autory obrazovky nebo spolupracovníky"
    name="ScreenAuthorsChange"
    submitLabel="Uložit"
    handleSubmit={handleSubmit}
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="screen-authors-change-textfield-role"
        name="role"
        label="Role"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="screen-authors-change-textfield-text"
        name="text"
        label="Osoby nebo text"
        validate={[Validation.required]}
        multiLine
      />
    </form>
  </Dialog>;

export default compose(
  connect(({ dialog: { data } }) => ({ initialValues: data }), null),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      await dispatch(
        changeScreenCollaborators(
          { role: formData.role, text: formData.text },
          props.initialValues
        )
      );
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "screenAuthorsChange"
  })
)(ScreenAuthorsChange);
