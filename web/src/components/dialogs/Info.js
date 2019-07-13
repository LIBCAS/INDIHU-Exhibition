import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, lifecycle } from "recompose";
import { reduxForm } from "redux-form";
import { get } from "lodash";

import Dialog from "./DialogWrap";

const Info = ({ handleSubmit, data }) => (
  <Dialog
    title={get(data, "title", "Info")}
    name="Info"
    handleSubmit={handleSubmit}
    submitLabel="Ok"
    noDialogMenu={get(data, "noDialogMenu")}
    noToolbar={get(data, "noToolbar")}
    big={get(data, "big")}
  >
    {get(data, "content") ? data.content : <p>{get(data, "text", "")}</p>}
  </Dialog>
);

export default compose(
  connect(
    ({ dialog: { data } }) => ({
      data
    }),
    null
  ),
  withHandlers({
    onSubmit: dialog => async () => {
      dialog.closeDialog();
    }
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (get(nextProps, "data.autoClose")) {
        setTimeout(() => {
          nextProps.onSubmit();
        }, get(nextProps, "data.autoCloseTime", 2000));
      }
    }
  }),
  reduxForm({
    form: "infoForm"
  })
)(Info);
