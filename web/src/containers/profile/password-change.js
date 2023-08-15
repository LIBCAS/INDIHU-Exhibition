import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import Button from "react-md/lib/Buttons/Button";

import TextField from "../../components/form/redux-form/text-field";
import * as Validation from "../../components/form/redux-form/validation";
import { updateCurrentUser } from "../../actions/user-actions";
import { setDialog } from "../../actions/dialog-actions";

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

const validate = (values) => {
  const errors = {};
  const { password, passwordSecond } = values;

  if (password !== passwordSecond) {
    errors.passwordSecond = "*Hesla nejsou totožná!";
  }

  return errors;
};

export default compose(
  connect(null, { updateCurrentUser, setDialog }),
  withHandlers({
    onSubmit:
      ({ updateCurrentUser, setDialog, initialValues }) =>
      async ({ password }) => {
        if (await updateCurrentUser({ ...initialValues, password })) {
          setDialog("Info", {
            title: "Změna hesla",
            text: "Heslo bylo úspěšně změněno.",
          });
        } else {
          setDialog("Info", {
            title: "Změna hesla",
            text: "Při změně hesla došlo k chybě.",
          });
        }
      },
  }),
  reduxForm({
    form: "userPasswForm",
    enableReinitialize: true,
    validate,
  })
)(PasswordChange);
