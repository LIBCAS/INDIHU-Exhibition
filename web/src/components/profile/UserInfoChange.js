import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get } from "lodash";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";

import TextField from "../form/TextField";
import * as Validation from "../form/Validation";
import { updateCurrentUser } from "../../actions/userActions";
import { setDialog } from "../../actions/dialogActions";

const Form = ({ handleSubmit, initialValues, activeForm, setActiveForm }) =>
  <div>
    {activeForm === "userInfo"
      ? <form className="flex-form" onSubmit={handleSubmit}>
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
              className="flex-form-submit"
              raised
              primary
              label="Potvrdit"
              type="submit"
            />
            <Button
              className="flex-form-submit"
              raised
              label="Zrušit"
              onClick={() => setActiveForm(null)}
            />
          </div>
        </form>
      : <div className="flex-form">
          <div className="flex-form editable">
            <p>
              <span>Užívatelské jméno: </span>
              {get(initialValues, "userName")}
            </p>
            <p>
              <span>Jméno: </span>
              {get(initialValues, "firstName")}&nbsp;{get(initialValues, "surname")}
            </p>
            <p>
              <span>Instituce: </span>
              {get(initialValues, "institution")}
            </p>
            <p>
              <span>E-mail: </span>
              {get(initialValues, "email")}
            </p>
            <div className="flex-row flex-centered">
              <Button
                className="flex-form-edit"
                flat
                label="Upravit"
                onClick={() => setActiveForm("userInfo")}
              >
                <FontIcon>edit</FontIcon>
              </Button>
            </div>
          </div>
        </div>}
  </div>;

export default compose(
  connect(null, { updateCurrentUser, setDialog }),
  withHandlers({
    onSubmit: ({
      updateCurrentUser,
      setDialog,
      setActiveForm,
      initialValues
    }) => async ({ userName, firstName, surname, institution, email }) => {
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
        setActiveForm(null);
      } else {
        setDialog("Info", {
          title: "Editace profilu",
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
