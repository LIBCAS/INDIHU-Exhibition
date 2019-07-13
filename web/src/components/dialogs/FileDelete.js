import React from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { FontIcon } from "react-md/lib";

import Dialog from "./DialogWrap";
import { deleteFile, tabFile, isFileUsed } from "../../actions/fileActions";

const FileDelete = ({ handleSubmit, data, activeExo, isFileUsed }) => (
  <Dialog
    title={<FontIcon className="color-black">delete</FontIcon>}
    name="FileDelete"
    handleSubmit={handleSubmit}
    submitLabel="Smazat"
  >
    <p>
      Vybraný soubor <strong>{get(data, "name", "")}</strong> bude smazán.
    </p>
    <div className="flex-row-nowrap flex-center">
      <FontIcon className="color-red">priority_high</FontIcon>
      <p>
        <strong style={{ fontSize: "0.9em" }}>
          Akce je nevratná.
          {data && activeExo && isFileUsed(data.id)
            ? ` Soubor je používán!`
            : ""}
        </strong>
      </p>
    </div>
  </Dialog>
);

export default compose(
  connect(
    ({ dialog: { data }, expo: { activeExo } }) => ({ data, activeExo }),
    { isFileUsed }
  ),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      if (await dispatch(deleteFile(props.data.id))) {
        dispatch(tabFile(null));
      }
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "fileDelete"
  })
)(FileDelete);
