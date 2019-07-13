import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import Button from "react-md/lib/Buttons/Button";

import TextField from "../form/TextField";
import * as Validation from "../form/Validation";
import { updateCurrentUser } from "../../actions/userActions";
import { setDialog } from "../../actions/dialogActions";

const Form = ({ handleSubmit }) => (
  <div>
    <form className="flex-form" onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="profile-userinfochange-textfield-"
        name="userName"
        label="Užívatelské jméno"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="profile-userinfochange-textfield-firstname"
        name="firstName"
        label="Jméno"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="profile-userinfochange-textfield-surname"
        name="surname"
        label="Přijmení"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="profile-userinfochange-textfield-institution"
        name="institution"
        label="Instituce"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="profile-userinfochange-textfield-email"
        name="email"
        label="E-mail"
        validate={[Validation.required]}
      />
      <div className="flex-row flex-centered">
        <Button
          className="flex-form-submit edit-profile-button"
          flat
          primary
          label="Upravit profil"
          type="submit"
        />
      </div>
    </form>
  </div>
);

export default compose(
  connect(
    null,
    { updateCurrentUser, setDialog }
  ),
  withHandlers({
    onSubmit: ({ updateCurrentUser, setDialog, initialValues }) => async ({
      userName,
      firstName,
      surname,
      institution,
      email
    }) => {
      if (
        await updateCurrentUser({
          ...initialValues,
          userName,
          firstName,
          surname,
          institution,
          email
        })
      ) {
        setDialog("Info", {
          title: "Úprava profilu",
          text: "Provedené změny v profilu byly uloženy."
        });
      } else {
        setDialog("Info", {
          title: "Úprava profilu",
          text: "Při provádění změn v profilu došlo k chybě."
        });
      }
    }
  }),
  reduxForm({
    form: "userInfoForm",
    enableReinitialize: true
  })
)(Form);
