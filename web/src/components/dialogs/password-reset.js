import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { passwordReset } from "../../actions/user-actions";
import { useTranslation, withTranslation } from "react-i18next";

const PasswordReset = ({ handleSubmit }) => {
  const { t } = useTranslation("expo", { keyPrefix: "passwordResetDialog" });

  return (
    <Dialog
      title={t("title")}
      name="PasswordReset"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="password-reset-textfield-email"
          label={t("emailField")}
          name="email"
          validate={[Validation.required, Validation.email]}
        />
      </form>
    </Dialog>
  );
};

export default compose(
  withTranslation("expo", { keyPrefix: "passwordResetDialog" }),
  withHandlers({
    onSubmit:
      (dialog) =>
      async (formData, dispatch, { t }) => {
        if (await dispatch(passwordReset(formData.email))) {
          dialog.setDialog("Info", {
            title: t("responseSuccess.title"),
            text: t("responseSuccess.text"),
          });
        } else {
          dialog.setDialog("Info", {
            title: t("responseFailure.title"),
            text: t("responseFailure.text"),
          });
        }
      },
  }),
  reduxForm({
    form: "passwordResetForm",
  })
)(PasswordReset);
