import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";

import Dialog from "./DialogWrap";
import TextField from "../form/TextField";
import * as Validation from "../form/Validation";
import { duplicateExpo } from "../../actions/expoActions";

const ExpoDuplicate = ({ handleSubmit }) =>
  <Dialog
    title="Duplikace výstavy"
    name="ExpoDuplicate"
    handleSubmit={handleSubmit}
    submitLabel="Duplikovat"
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="expo-duplicate-textfield-name"
        label="Název výstavy"
        name="name"
        validate={[Validation.required]}
      />
    </form>
  </Dialog>;

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      if (await dispatch(duplicateExpo(formData.name, props.data.id))) {
        dialog.closeDialog();
      }
    }
  }),
  reduxForm({
    form: "expoDuplicate"
  })
)(ExpoDuplicate);
