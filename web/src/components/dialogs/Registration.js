import React from "react";
import Dialog from "./DialogWrap";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import TextField from "../form/TextField";
import Captcha from "../form/Captcha";
import * as Validation from "../form/Validation";
import { registration, signIn } from "../../actions/userActions";
import { resetForm } from "../../actions/appActions";

const Registration = ({ handleSubmit, change }) =>
  <Dialog
    title="Registrační formulář"
    name="Registration"
    handleSubmit={handleSubmit}
    submitLabel="Registrovat"
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="registration-textfield-firstname"
        name="firstName"
        label="Jméno"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="registration-textfield-surname"
        name="surname"
        label="Příjmení"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="registration-textfield-institution"
        name="institution"
        label="Instituce"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="registration-textfield-email"
        name="email"
        label="E-mail"
        validate={[Validation.required, Validation.email]}
      />
      <Field
        component={TextField}
        componentId="registration-textfield-password"
        name="password"
        type="password"
        label="Heslo (min 5 znaků)"
        validate={[Validation.required, Validation.password]}
      />
      <div className="flex-row flex-centered">
        <Field
          component={Captcha}
          name="captcha"
          changeValue={change}
          validate={[Validation.required]}
        />
      </div>
      <p>Stiskem tlačítka Registrovat souhlasíte s Podmínkami použití.</p>
    </form>
  </Dialog>;

export default compose(
  withRouter,
  connect(null, { registration, signIn, resetForm }),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      const ret = await dispatch(registration(formData));
      if (ret === 201) {
        props.resetForm("sign-up");
        await dialog.closeDialog();
        dialog.setDialog("Info", {
          title: "Potvrzení registrace",
          text: `Potvrďte svou registraci linkem zaslaným na adresu ${formData.email}`
        });
      } else if (ret === 412) {
        props.resetForm("sign-up");
        await dialog.closeDialog();
        dialog.setDialog("Info", {
          title: "E-mailová adresa nalezena",
          text:
            "Účet s Vaší e-mailovou adresou byl již nalezen. Zkuste se přihlásit svými korporátními přihlašovacími údaji."
        });
      } else if (ret === 409) {
        throw new SubmissionError({
          email: "*Účet s danou emailovou adresou již existuje"
        });
      } else {
        throw new SubmissionError({
          captcha: "Registrace neúspěšná"
        });
      }
    }
  }),
  reduxForm({
    form: "sign-up"
  })
)(Registration);
