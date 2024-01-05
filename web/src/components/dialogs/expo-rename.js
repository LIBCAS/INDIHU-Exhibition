import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { renameExpo } from "../../actions/expoActions";
import { useTranslation } from "react-i18next";

const ExpoRename = ({ handleSubmit }) => {
  const { t } = useTranslation("expo", { keyPrefix: "expoRenameDialog" });

  return (
    <Dialog
      title={t("title")}
      name="ExpoRename"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="expo-rename-textfield-name"
          label={t("nameFieldLabel")}
          name="name"
          validate={[Validation.required]}
        />
      </form>
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      if (await dispatch(renameExpo(props.data.id, formData.name))) {
        dialog.closeDialog();
      }
    },
  }),
  reduxForm({
    form: "expoRename",
  })
)(ExpoRename);
