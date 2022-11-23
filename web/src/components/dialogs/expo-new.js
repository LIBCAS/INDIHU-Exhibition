import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/text-field";
import * as Validation from "../form/validation";
import { newExpo } from "../../actions/expoActions";

const ExpoNew = ({ handleSubmit }) => (
  <Dialog
    title="Nová výstava"
    name="ExpoNew"
    handleSubmit={handleSubmit}
    submitLabel="Vytvořit"
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="expo-new-textfield-name"
        name="name"
        label="Název výstavy"
        validate={[Validation.required]}
      />
    </form>
  </Dialog>
);

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
