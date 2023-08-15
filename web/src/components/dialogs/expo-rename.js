import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { renameExpo } from "../../actions/expoActions";

const ExpoRename = ({ handleSubmit }) => (
  <Dialog
    title="Nový název výstavy"
    name="ExpoRename"
    handleSubmit={handleSubmit}
    submitLabel="Přejmenovat"
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="expo-rename-textfield-name"
        label="Název výstavy"
        name="name"
        validate={[Validation.required]}
      />
    </form>
  </Dialog>
);

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
