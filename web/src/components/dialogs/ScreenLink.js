import React from "react";
import { connect } from "react-redux";
import {
  reduxForm
  // Field
} from "redux-form";
import { compose, withHandlers } from "recompose";
import CopyToClipboard from "react-copy-to-clipboard";
import Button from "react-md/lib/Buttons/Button";

import Dialog from "./DialogWrap";
// import TextField from "../form/TextField";

const ScreenLink = ({ handleSubmit, initialValues, data }) =>
  initialValues.link
    ? <Dialog
        title="Odkaz obrazovky"
        name="ScreenLink"
        submitLabel="Ok"
        handleSubmit={handleSubmit}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex-row flex-centered">
            {`${window.location.origin}/view/${initialValues.link}`}
            {/*<Field component={TextField} componentId="screen-link-textfield-link" name="link" disabled />*/}
          </div>
          <CopyToClipboard text={`${window.location.origin}/view/${initialValues.link}`}>
            <Button raised label="Kopírovat do schránky" />
          </CopyToClipboard>
        </form>
      </Dialog>
    : <div />;

export default compose(
  connect(({ dialog: { data } }) => ({
    initialValues: { link: data ? data.link : null }
  })),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "screenLink",
    enableReinitialize: true
  })
)(ScreenLink);
