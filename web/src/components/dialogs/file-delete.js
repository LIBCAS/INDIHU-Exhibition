import { connect } from "react-redux";
import { get } from "lodash";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { FontIcon } from "react-md/lib";

import Dialog from "./dialog-wrap";
import { deleteFile, tabFile, isFileUsed } from "../../actions/file-actions";

const FileDelete = ({ handleSubmit, data, isFileUsed, dialogName }) => {
  const screen =
    data && dialogName === "FileDelete" ? isFileUsed(data.id) : false;
  return (
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
        <p style={{ fontSize: "0.9em" }}>
          <strong>Akce je nevratná.</strong>
        </p>
      </div>
      {screen ? (
        <p style={{ fontSize: "0.9em", marginLeft: 24 }}>
          <br />
          Soubor je používán v obrazovce <strong>{screen}</strong>.
        </p>
      ) : (
        ""
      )}
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data, name } }) => ({ data, dialogName: name }), {
    isFileUsed,
  }),
  withHandlers({
    onSubmit: (dialog) => async (_, dispatch, props) => {
      if (await dispatch(deleteFile(props.data.id))) {
        dispatch(tabFile(null));
      }
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "fileDelete",
  })
)(FileDelete);
