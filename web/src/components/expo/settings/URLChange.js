import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import Button from "react-md/lib/Buttons/Button";

import TextField from "../../form/TextField";
import * as Validation from "../../form/Validation";

import { resetForm } from "../../../actions/appActions";
import { checkExpoURL } from "../../../actions/expoActions";
import { setDialog } from "../../../actions/dialogActions";

const validURL = value =>
  !/^[a-z0-9-]*$/i.test(value)
    ? "*URL může obsahovat jenom znaky abecedy, čísla a pomlčku"
    : undefined;

const URLChange = ({ handleSubmit, resetForm }) =>
  <div>
    <form onSubmit={handleSubmit}>
      <div className="row">
        <p className="url">
          {window.location.origin}/view/
        </p>
        <Field
          component={TextField}
          componentId="expo-url-change-textfield-url"
          validate={[Validation.required, validURL]}
          name="url"
        />
      </div>
      <div className="buttons">
        <Button raised label="Storno" onClick={() => resetForm("URLChange")} />
        <Button raised label="Aktualizovat" type="submit" />
      </div>
    </form>
  </div>;

export default compose(
  connect(null, { resetForm, checkExpoURL, setDialog }),
  withHandlers({
    onSubmit: ({ initialValues, checkExpoURL, setDialog }) => async ({
      url
    }) => {
      if (await checkExpoURL(url)) {
        setDialog("Info", {
          title: "Změna url výstavy",
          text: "Url výstavy byla úspěšně změněna."
        });
      } else {
        throw new SubmissionError({
          url: "*Tato URL adresa je již obsazena."
        });
      }
    }
  }),
  reduxForm({
    form: "URLChange"
  })
)(URLChange);
