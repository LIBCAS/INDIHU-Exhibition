import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { compose, withHandlers } from "recompose";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";

import { changeScreenCollaborators } from "../../actions/expoActions";
import { useTranslation } from "react-i18next";

const ScreenAuthorsChange = ({ handleSubmit }) => {
  const { t } = useTranslation("expo", {
    keyPrefix: "screenAuthorsChangeDialog",
  });

  return (
    <Dialog
      title={t("title")}
      name="ScreenAuthorsChange"
      submitLabel={t("submitLabel")}
      handleSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="screen-authors-change-textfield-role"
          name="role"
          label={t("roleField")}
          validate={[Validation.required]}
        />
        <Field
          component={TextField}
          componentId="screen-authors-change-textfield-text"
          name="text"
          label={t("textField")}
          validate={[Validation.required]}
          multiLine
        />
      </form>
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ initialValues: data }), null),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      await dispatch(
        changeScreenCollaborators(
          { role: formData.role, text: formData.text },
          props.initialValues
        )
      );
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "screenAuthorsChange",
  })
)(ScreenAuthorsChange);
