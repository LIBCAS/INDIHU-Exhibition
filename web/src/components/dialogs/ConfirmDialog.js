import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get, isFunction } from "lodash";
import Dialog from "./DialogWrap";

const ConfirmDialog = ({ handleSubmit, data }) => (
  <Dialog
    title={get(data, "title")}
    name="ConfirmDialog"
    handleSubmit={handleSubmit}
    submitLabel="Potvrdit"
  >
    <p>{get(data, "text")}</p>
  </Dialog>
);

export default compose(
  connect(
    ({ dialog: { data } }) => ({ data }),
    null
  ),
  withRouter,
  withHandlers({
    onSubmit: ({ data, closeDialog }) => async () => {
      if (isFunction(get(data, "onSubmit"))) {
        await data.onSubmit();
      }

      closeDialog();
    }
  }),
  reduxForm({
    form: "confirmDialog"
  })
)(ConfirmDialog);
