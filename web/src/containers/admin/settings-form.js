import { connect } from "react-redux";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { compose, withHandlers, lifecycle, withState } from "recompose";
import Button from "react-md/lib/Buttons/Button";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import TextField from "../../components/form/redux-form/text-field";
import * as Validation from "../../components/form/redux-form/validation";

import {
  getAdminSettings,
  changeAdminSettings,
} from "../../actions/admin-actions";
import { useTranslation } from "react-i18next";

const Form = ({
  handleSubmit,
  setActiveForm,
  allowedRegistration,
  setAllowedRegistration,
  automaticRegistration,
  setAutomaticRegistration,
}) => {
  const { t } = useTranslation("admin-settings");

  return (
    <form className="flex-form" onSubmit={handleSubmit}>
      <Checkbox
        id="admin-checkbox-allowedregistration"
        name="simple-checkboxes"
        label={t("registrationAllowed")}
        checked={allowedRegistration}
        value={allowedRegistration}
        onChange={(value) => setAllowedRegistration(value)}
      />
      <Checkbox
        id="admin-checkbox-automaticregistration"
        name="simple-checkboxes"
        label={t("automaticRegistration")}
        checked={automaticRegistration}
        value={automaticRegistration}
        onChange={(value) => setAutomaticRegistration(value)}
      />
      <Field
        component={TextField}
        componentId="admin-textfield-lockduration"
        name="lockDuration"
        label={t("lockExhibition")}
        suffix="vteřin"
        validate={[Validation.required]}
      />
      <div className="flex-row flex-centered">
        <Button
          className="flex-form-submit"
          raised
          primary
          label={t("confirmActionLabel")}
          type="submit"
        />
        <Button
          className="flex-form-submit"
          raised
          label={t("cancelActionLabel")}
          onClick={() => setActiveForm(null)}
        />
      </div>
    </form>
  );
};

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
