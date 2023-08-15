import { connect } from "react-redux";
import { reduxForm, Field, reset } from "redux-form";
import { compose, withHandlers } from "recompose";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";

import { addScreenCollaborators } from "../../actions/expoActions";

const ScreenAuthorsAdd = ({ handleSubmit }) => (
  <Dialog
    title="Přidat autory výstavy nebo spolupracovníky"
    name="ScreenAuthorsAdd"
    submitLabel="Uložit"
    handleSubmit={handleSubmit}
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="screen-authors-add-textfield-role"
        name="role"
        label="Role"
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="screen-authors-add-textfield-text"
        name="text"
        label="Osoby nebo text"
        validate={[Validation.required]}
        multiLine
      />
    </form>
  </Dialog>
);

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
