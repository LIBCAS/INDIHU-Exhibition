import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { map } from "lodash";
import Dialog from "./DialogWrap";
import Radio from "react-md/lib/SelectionControls/Radio";
import { moveFile, tabFile } from "../../actions/fileActions";
import { changeRadioState } from "../../actions/appActions";

const FileMove = ({
  handleSubmit,
  data,
  radio,
  structure,
  changeRadioState
}) => {
  const folders = structure ? structure.files : null;
  return (
    <Dialog
      title="Přesunutí souboru"
      name="FileMove"
      handleSubmit={handleSubmit}
      submitLabel="Přesunout"
    >
      <p>
        Kam chcete přesunout soubor{data && data.name ? ` ${data.name}` : ""}?
      </p>
      {folders &&
        <form onSubmit={handleSubmit}>
          {map(folders, (folder, i) =>
            <div key={i}>
              {folder.name
                ? <Radio
                    id={`fileMove-${folder.name}`}
                    name={`FOLDER_${folder.name}`}
                    className="radio-option"
                    value={`FOLDER_${folder.name}`}
                    label={folder.name}
                    checkedIconChildren={"folder"}
                    uncheckedIconChildren={"folder_open"}
                    checked={radio === `FOLDER_${folder.name}`}
                    onChange={() => changeRadioState(`FOLDER_${folder.name}`)}
                  />
                : <Radio
                    id={`fileMove-${folder.name}`}
                    name={"ROOT"}
                    className="radio-option"
                    value={"ROOT"}
                    label={"Nezařazené"}
                    checkedIconChildren={"folder"}
                    uncheckedIconChildren={"folder_open"}
                    checked={radio === "ROOT"}
                    onChange={() => changeRadioState("ROOT")}
                  />}
            </div>
          )}
        </form>}
    </Dialog>
  );
};

export default compose(
  connect(
    ({
      dialog: { data },
      app: { radio },
      expo: { activeExpo: { structure } }
    }) => ({
      data,
      radio,
      structure
    }),
    { changeRadioState }
  ),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      const { radio, data } = props;
      if (radio === "ROOT") dispatch(moveFile(data.file, null, data.folder));
      else dispatch(moveFile(data.file, radio.substr(7), data.folder));
      dispatch(tabFile(null));
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "fileMove"
  })
)(FileMove);
