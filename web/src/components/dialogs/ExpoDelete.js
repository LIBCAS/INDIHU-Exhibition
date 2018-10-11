import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";
import Dialog from "./DialogWrap";
import { deleteExpo } from "../../actions/expoActions";

const ExpoDelete = ({ handleSubmit, data }) =>
  <Dialog
    title="Smazání výstavy"
    name="ExpoDelete"
    handleSubmit={handleSubmit}
    submitLabel="Smazat"
  >
    <p>
      Vybraná výstava s názvem <strong>{get(data, "name")}</strong> bude
      smazána.
    </p>
    <p>
      Tato operace je nevratná a smaže výstavu včetne všech dokumentů a
      podkladů!
    </p>
  </Dialog>;

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  withHandlers({
    onSubmit: dialog => async (_, dispatch, props) => {
      if (await dispatch(deleteExpo(props.data.id))) {
        dialog.closeDialog();
      }
    }
  }),
  reduxForm({
    form: "expoDelete"
  })
)(ExpoDelete);
