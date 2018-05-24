import React from "react";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./DialogWrap";
import TextField from "../form/TextField";
import * as Validation from "../form/Validation";
import { passwordReset } from "../../actions/userActions";

const PasswordReset = ({ handleSubmit }) =>
  <Dialog
    title="Reset hesla"
    name="PasswordReset"
    handleSubmit={handleSubmit}
    submitLabel="Resetovat"
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="password-reset-textfield-email"
        label="Email"
        name="email"
        validate={[Validation.required, Validation.email]}
      />
    </form>
  </Dialog>;

export default compose(
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      if (await dispatch(passwordReset(formData.email))) {
        dialog.setDialog("Info", {
          title: "Reset hesla úspěšný",
          text: "Nové heslo bylo zasláno na zadaný email."
        });
      } else {
        dialog.setDialog("Info", {
          title: "Reset hesla neúspěšný",
          text: "Reset hesla byl neúspěšný."
        });
      }
    }
  }),
  reduxForm({
    form: "passwordResetForm"
  })
)(PasswordReset);
