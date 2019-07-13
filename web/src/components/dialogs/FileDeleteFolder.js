import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { get } from "lodash";
import { reduxForm } from "redux-form";
import { FontIcon } from "react-md/lib";

import Dialog from "./DialogWrap";
import { deleteFolder, isFileInFolderUsed } from "../../actions/fileActions";

const FileDeleteFolder = ({
  handleSubmit,
  data,
  activeExo,
  isFileInFolderUsed
}) => (
  <Dialog
    title={<FontIcon className="color-black">delete</FontIcon>}
    name="FileDeleteFolder"
    handleSubmit={handleSubmit}
    submitLabel="Smazat"
  >
    <p>
      Vybraná složka <strong>{get(data, "name", "")}</strong> a všechen její
      obsah bude smazán.
    </p>
    <div className="flex-row-nowrap flex-center">
      <FontIcon className="color-red">priority_high</FontIcon>
      <p>
        <strong style={{ fontSize: "0.9em" }}>
          Akce je nevratná.
          {data && activeExo && isFileInFolderUsed(data.name)
            ? ` Jeden ze souborů ve složce je používán!`
            : ""}
        </strong>
      </p>
    </div>
  </Dialog>
);

export default compose(
  connect(
    ({ dialog: { data }, expo: { activeExo } }) => ({ data, activeExo }),
    {
      isFileInFolderUsed
    }
  ),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      dispatch(deleteFolder(props.data.name));
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "fileDeleteFolder"
  })
)(FileDeleteFolder);
