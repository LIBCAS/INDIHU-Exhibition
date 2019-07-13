import React from "react";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, lifecycle, withHandlers, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import AppHeader from "../components/AppHeader";
import ComponentLoader from "../components/ComponentLoader";
import Button from "react-md/lib/Buttons/Button";
import Captcha from "../components/form/Captcha";
import TextField from "../components/form/TextField";
import * as Validation from "../components/form/Validation";
import { setDialog, closeDialog } from "../actions/dialogActions";
import {
  availableRegistration,
  signIn,
  registration
} from "../actions/userActions";
import { resetForm } from "../actions/appActions";

const Authentication = ({
  handleSubmit,
  setDialog,
  regAvailable,
  isSignIn,
  change,
  loader,
  captchaKey
}) => (
  <div className="authentication-container">
    <AppHeader authStyle isSignIn={!!isSignIn} />
    <div className="authentication">
      <div className="left">
        <h1>Kreativní nástroj pro tvorbu virtuálních výstav</h1>
        <p>
          Vytvářejte působivé online prezentace na libovolná témata, která budou
          návštěvníkům dostupná na webu. INDIHU Exhibition umožňuje vtáhnout
          návštěvníka do děje a tvořit obsahově bohaté prezentace. Kombinujte
          obrázky, texty, fotogalerie, videa, mapy s dalšími možnostmi. Zařaďte
          do výstavy i drobné interaktivní hry.
        </p>
      </div>
      <div className="right">
        {!loader && (regAvailable || isSignIn) ? (
          <div>
            <h3>
              <strong>
                {isSignIn ? "Přihlášení" : "Začněte vytvářet výstavy"}
              </strong>
            </h3>
            {!isSignIn && <p>Nástroj je zcela zdarma</p>}
          </div>
        ) : (
          <div />
        )}
        {loader ? (
          <div className="full-width flex-col flex-centered margin-top-small">
            <ComponentLoader />
            <h4 className="margin-top">Načítá se registrační formulář.</h4>
          </div>
        ) : isSignIn ? (
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
            <div className="authentication-buttons">
              <Button
                raised
                primary
                label="Přihlásit"
                type="submit"
                className="authentication-button"
              />
              <Button
                flat
                label="Resetovat heslo"
                onClick={() => setDialog("PasswordReset")}
                className="authentication-button margin-left-small"
              />
            </div>
          </form>
        ) : regAvailable ? (
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
            <div className="flex-row flex-centered margin-bottom-very-small margin-top-very-small">
              <Field
                key={captchaKey}
                component={Captcha}
                name="captcha"
                changeValue={change}
                validate={[Validation.required]}
              />
            </div>
            <p className="authentication-registration-text">
              Stiskem tlačítka Registrovat souhlasíte s Podmínkami použití.
            </p>
            <div className="authentication-buttons">
              <Button
                raised
                primary
                label="Registrovat"
                type="submit"
                className="authentication-button"
              />
            </div>
          </form>
        ) : (
          <h4 className="text-center margin-none">
            <strong>Registrace nejsou v současné době povoleny.</strong>
          </h4>
        )}
      </div>
    </div>
    <div className="authentication-footer">
      <div className="inner-left">
        <div>
          Projekt INDIHU - <a href="https://indihu.cz/">https://indihu.cz/</a>
        </div>
        <div>
          Info o INDIHU Exhibition -{" "}
          <a href="https://github.com/LIBCAS/INDIHU-Exhibition">
            https://github.com/LIBCAS/INDIHU-Exhibition
          </a>
        </div>
      </div>
      <div className="inner-right">
        Aplikace je optimalizována pro prohlížeč Google Chrome.
      </div>
    </div>
  </div>
);

export default compose(
  withRouter,
  withState("loader", "showLoader", false),
  withState("captchaKey", "setCaptchaKey", false),
  connect(
    null,
    {
      setDialog,
      closeDialog,
      availableRegistration,
      signIn,
      registration,
      resetForm
    }
  ),
  lifecycle({
    async componentWillMount() {
      const { isSignIn, showLoader } = this.props;

      if (!isSignIn) {
        showLoader(true);
        const regAvailable = await this.props.availableRegistration();
        this.setState({ regAvailable });
        showLoader(false);
      }
    }
  }),
  withHandlers({
    onSubmit: ({
      signIn,
      history,
      isSignIn,
      registration,
      resetForm,
      setDialog,
      closeDialog,
      setCaptchaKey,
      captchaKey
    }) => async formData => {
      if (isSignIn) {
        const signSuccess = await signIn(formData.name, formData.password);
        if (signSuccess) history.push("/exhibitions");
        else
          throw new SubmissionError({
            password: "*Chybné přihlašovací údaje"
          });
      } else {
        const ret = await registration(formData);
        if (ret === 201) {
          resetForm("auth");
          setCaptchaKey(!captchaKey);
          await closeDialog();
          setDialog("Info", {
            title: "Potvrzení registrace",
            text: `Potvrďte svou registraci linkem zaslaným na adresu ${
              formData.email
            }`
          });
        } else if (ret === 412) {
          resetForm("auth");
          setCaptchaKey(!captchaKey);
          await closeDialog();
          setDialog("Info", {
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
    }
  }),
  reduxForm({
    form: "auth"
  })
)(Authentication);
