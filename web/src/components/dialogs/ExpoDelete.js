import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import Dialog from "./DialogWrap";
import { deleteExpo } from "../../actions/expoActions";

const ExpoDelete = ({ handleSubmit, data }) => (
  <Dialog title="Smazání výstavy" name="ExpoDelete" handleSubmit={handleSubmit} submitLabel="Smazat">
    <p>Vybraná výstava {data !== null && data !== undefined ? `s názvem "${data.name}" ` : ""}bude smazána.</p>
    <p>Tato operace je nevratná a smaže výstavu včetne všech dokumentů a podkladů!</p>
  </Dialog>
);

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      if (await dispatch(deleteExpo(props.data.id))) {
        dialog.closeDialog();
      }
    }
  }),
  reduxForm({
    form: "expoDelete"
  })
)(ExpoDelete);
