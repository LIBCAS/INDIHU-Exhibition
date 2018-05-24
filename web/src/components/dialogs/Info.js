import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, lifecycle } from "recompose";
import { reduxForm } from "redux-form";
import { get } from "lodash";

import Dialog from "./DialogWrap";

const Info = ({ handleSubmit, data }) =>
  <Dialog
    title={data && data.title ? data.title : "Info"}
    name="Info"
    handleSubmit={handleSubmit}
    submitLabel="Ok"
  >
    <p>
      {data && data.text ? data.text : ""}
    </p>
  </Dialog>;

export default compose(
  connect(
    ({ dialog: { data } }) => ({
      data
    }),
    null
  ),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      dialog.closeDialog();
    }
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (get(nextProps, "data.autoClose")) {
        setTimeout(() => {
          nextProps.onSubmit();
        }, 2000);
      }
    }
  }),
  reduxForm({
    form: "infoForm"
  })
)(Info);
