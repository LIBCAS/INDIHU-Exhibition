import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { duplicateExpo } from "../../actions/expoActions";
import { useTranslation } from "react-i18next";

const ExpoDuplicate = ({ handleSubmit }) => {
  const { t } = useTranslation("expo", { keyPrefix: "expoDuplicateDialog" });

  return (
    <Dialog
      title={t("title")}
      name="ExpoDuplicate"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="expo-duplicate-textfield-name"
          label={t("newDuplicatedExpoNameFieldLabel")}
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
      if (
        await dispatch(
          duplicateExpo(
            formData.name,
            props.data.id,
            props.data.expositionsFilterState
          )
        )
      ) {
        dialog.closeDialog();
      }
    },
  }),
  reduxForm({
    form: "expoDuplicate",
  })
)(ExpoDuplicate);
