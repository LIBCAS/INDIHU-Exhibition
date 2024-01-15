import { connect } from "react-redux";
import { reduxForm, Field, reset } from "redux-form";
import { compose, withHandlers } from "recompose";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";

import { addScreenCollaborators } from "../../actions/expoActions";
import { useTranslation } from "react-i18next";

const ScreenAuthorsAdd = ({ handleSubmit }) => {
  const { t } = useTranslation("expo", { keyPrefix: "screenAuthorsAddDialog" });

  return (
    <Dialog
      title={t("title")}
      name="ScreenAuthorsAdd"
      submitLabel={t("submitLabel")}
      handleSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="screen-authors-add-textfield-role"
          name="role"
          label={t("roleField")}
          validate={[Validation.required]}
        />
        <Field
          component={TextField}
          componentId="screen-authors-add-textfield-text"
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
  connect(null, { reset, addScreenCollaborators }),
  withHandlers({
    onSubmit:
      ({ reset, closeDialog, addScreenCollaborators }) =>
      async (formData) => {
        addScreenCollaborators({ role: formData.role, text: formData.text });
        reset("screenAuthorsAdd");
        closeDialog();
      },
  }),
  reduxForm({
    form: "screenAuthorsAdd",
  })
)(ScreenAuthorsAdd);
