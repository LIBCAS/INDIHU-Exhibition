import { connect } from "react-redux";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { compose, withHandlers, lifecycle, withState } from "recompose";
import Button from "react-md/lib/Buttons/Button";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import TextField from "../form/text-field";
import * as Validation from "../form/validation";
import {
  getAdminSettings,
  changeAdminSettings,
} from "../../actions/admin-actions";

const Form = ({
  handleSubmit,
  setActiveForm,
  allowedRegistration,
  setAllowedRegistration,
  automaticRegistration,
  setAutomaticRegistration,
}) => (
  <form className="flex-form" onSubmit={handleSubmit}>
    <Checkbox
      id="admin-checkbox-allowedregistration"
      name="simple-checkboxes"
      label="Registrace povolena"
      checked={allowedRegistration}
      value={allowedRegistration}
      onChange={(value) => setAllowedRegistration(value)}
    />
    <Checkbox
      id="admin-checkbox-automaticregistration"
      name="simple-checkboxes"
      label="Automatická registrace"
      checked={automaticRegistration}
      value={automaticRegistration}
      onChange={(value) => setAutomaticRegistration(value)}
    />
    <Field
      component={TextField}
      componentId="admin-textfield-lockduration"
      name="lockDuration"
      label="Zamknutí výstavy"
      suffix="vteřin"
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
);

export default compose(
  connect(null, {
    changeAdminSettings,
    getAdminSettings,
  }),
  withState("allowedRegistration", "setAllowedRegistration", false),
  withState("automaticRegistration", "setAutomaticRegistration", false),
  withHandlers({
    onSubmit:
      ({
        settings,
        allowedRegistration,
        automaticRegistration,
        changeAdminSettings,
        setActiveForm,
        getAdminSettings,
      }) =>
      async ({ lockDuration }) => {
        if (
          await changeAdminSettings({
            ...settings,
            allowedRegistration,
            automaticRegistration,
            lockDuration,
          })
        ) {
          getAdminSettings();
          setActiveForm(null);
        } else {
          throw new SubmissionError({
            lockDuration: "*Nastavení se nepodařilo změnit",
          });
        }
      },
  }),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { setAllowedRegistration, setAutomaticRegistration, settings } =
        this.props;

      setAllowedRegistration(settings.allowedRegistration);
      setAutomaticRegistration(settings.automaticRegistration);
    },
  }),
  reduxForm({
    form: "adminSettingsForm",
    enableReinitialize: true,
  })
)(Form);
