import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { get, isEmpty } from "lodash";
import { reduxForm } from "redux-form";
import { FontIcon } from "react-md/lib";

import Dialog from "./DialogWrap";
import { deleteFolder, isFileInFolderUsed } from "../../actions/fileActions";

const FileDeleteFolder = ({ handleSubmit, data, isFileInFolderUsed }) => {
  const screens = data ? isFileInFolderUsed(data.name) : false;
  return (
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
        <p style={{ fontSize: "0.9em" }}>
          <strong>Akce je nevratná.</strong>
        </p>
      </div>
      {!isEmpty(screens) ? (
        <p style={{ fontSize: "0.9em", marginLeft: 24 }}>
          <br />
          Soubory ze složky jsou používány v obrazovkách:
          {screens.map(screen => (
            <span key={screen}>
              <br />
              <strong>{screen}</strong>
            </span>
          ))}
          .
        </p>
      ) : (
        ""
      )}
    </Dialog>
  );
};

export default compose(
  connect(
    ({ dialog: { data } }) => ({ data }),
    {
      isFileInFolderUsed
    }
  ),
  withHandlers({
    onSubmit: dialog => async (_, dispatch, props) => {
      dispatch(deleteFolder(props.data.name));
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "fileDeleteFolder"
  })
)(FileDeleteFolder);
