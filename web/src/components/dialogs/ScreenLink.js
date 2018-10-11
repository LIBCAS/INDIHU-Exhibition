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

const ScreenLink = ({ handleSubmit, initialValues, data }) =>
  initialValues.link
    ? <Dialog
        title="Odkaz obrazovky"
        name="ScreenLink"
        submitLabel="Zavřít"
        handleSubmit={handleSubmit}
        noStornoButton={true}
        big={true}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex-row">
            <h4>{`${window.location.origin}/view/${initialValues.link}`}</h4>
          </div>
          <CopyToClipboard
            text={`${window.location.origin}/view/${initialValues.link}`}
          >
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
