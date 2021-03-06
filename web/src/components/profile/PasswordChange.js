import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import Button from "react-md/lib/Buttons/Button";

import TextField from "../form/TextField";
import * as Validation from "../form/Validation";
import { updateCurrentUser } from "../../actions/userActions";
import { setDialog } from "../../actions/dialogActions";

const PasswordChange = ({ handleSubmit }) => (
  <div>
    <form className="flex-form" onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="profile-password-change-textfield-password"
        name="password"
        type="password"
        label="Nové heslo"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="profile-password-change-textfield-passwordsecond"
        name="passwordSecond"
        type="password"
        label="Potvrdit heslo"
        validate={[Validation.required]}
      />
      <div className="flex-row flex-centered">
        <Button
          className="flex-form-submit edit-profile-button"
          flat
          primary
          label="Změnit heslo"
          type="submit"
        />
      </div>
    </form>
  </div>
);

const validate = (values, props) => {
  const errors = {};
  const { password, passwordSecond } = values;

  if (password !== passwordSecond) {
    errors.passwordSecond = "*Hesla nejsou totožná!";
  }

  return errors;
};

export default compose(
  connect(
    null,
    { updateCurrentUser, setDialog }
  ),
  withHandlers({
    onSubmit: ({
      updateCurrentUser,
      setDialog,
      setActiveForm,
      initialValues
    }) => async ({ password }) => {
      if (await updateCurrentUser({ ...initialValues, password })) {
        setDialog("Info", {
          title: "Změna hesla",
          text: "Heslo bylo úspěšně změněno."
        });
      } else {
        setDialog("Info", {
          title: "Změna hesla",
          text: "Při změně hesla došlo k chybě."
        });
      }
    }
  }),
  reduxForm({
    form: "userPasswForm",
    enableReinitialize: true,
    validate
  })
)(PasswordChange);
