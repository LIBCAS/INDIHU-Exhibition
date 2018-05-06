import { useTranslation } from "react-i18next";

import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { newExpo } from "../../actions/expoActions";

const ExpoNew = ({ handleSubmit }) => {
  const { t } = useTranslation("exhibitions-page");

  return (
    <Dialog
      title={t("dialog.newExpoTitle")}
      name="ExpoNew"
      handleSubmit={handleSubmit}
      submitLabel={t("dialog.submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="expo-new-textfield-name"
          name="name"
          label={t("dialog.newExpoLabel")}
          validate={[Validation.required]}
        />
      </form>
    </Dialog>
  );
};

export default compose(
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      const id = await dispatch(newExpo(formData.name));

      if (id) {
        props.history.push(`/expo/${id}/structure`);
        dialog.closeDialog();
      }
    },
  }),
  reduxForm({
    form: "expoNew",
  })
)(ExpoNew);
