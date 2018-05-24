import React from "react";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, lifecycle, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import AppHeader from "../components/AppHeader";
import Button from "react-md/lib/Buttons/Button";
import TextField from "../components/form/TextField";
import * as Validation from "../components/form/Validation";
import { setDialog } from "../actions/dialogActions";
import { availableRegistration, signIn } from "../actions/userActions";

const Authentication = ({ handleSubmit, setDialog, regAvailable }) =>
  <div>
    <AppHeader authStyle />
    <div className="container form">
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="authentification-textfield-name"
          name="name"
          label="Užívatelské jméno/e-mail"
          validate={[Validation.required]}
        />
        <Field
          component={TextField}
          componentId="authentification-textfield-password"
          name="password"
          type="password"
          label="Heslo"
          validate={[Validation.required]}
        />
        <div className="flex">
          {regAvailable &&
            <Button
              flat
              label="Registrovat"
              onClick={() => setDialog("Registration")}
            />}
          <Button
            flat
            label="Resetovat heslo"
            onClick={() => setDialog("PasswordReset")}
          />
          <Button flat label="Přihlásit" type="submit" />
        </div>
      </form>
    </div>
  </div>;

export default compose(
  withRouter,
  connect(null, { setDialog, availableRegistration, signIn }),
  lifecycle({
    async componentWillMount() {
      const regAvailable = await this.props.availableRegistration();
      this.setState({ regAvailable });
    }
  }),
  withHandlers({
    onSubmit: ({ signIn, history }) => async ({ name, password }) => {
      const signSuccess = await signIn(name, password);
      if (signSuccess) history.push("/expositions");
      else
        throw new SubmissionError({
          password: "*Nesprávne přihlašovací údaje"
        });
    }
  }),
  reduxForm({
    form: "sign-in"
  })
)(Authentication);
