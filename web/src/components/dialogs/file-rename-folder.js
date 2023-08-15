import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { renameFolder } from "../../actions/file-actions";

const FileRenameFolder = ({ handleSubmit }) => (
  <Dialog
    title="Přejmenovat složku"
    name="FileRenameFolder"
    handleSubmit={handleSubmit}
    submitLabel="Přejmenovat"
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="file-rename-folder-textfield-name"
        label="Nový název složky"
        name="name"
        validate={[Validation.required]}
      />
    </form>
  </Dialog>
);

export default compose(
  connect(
    ({ dialog: { data } }) => ({ data, initialValues: { ...data } }),
    null
  ),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      if (await dispatch(renameFolder(formData.name, props.data.name))) {
        dialog.closeDialog();
      } else
        throw new SubmissionError({
          name: "Složka s tímto jménem již existuje.",
        });
    },
  }),
  reduxForm({
    form: "fileRenameFolder",
    enableReinitialize: true,
  })
)(FileRenameFolder);
