import React from "react";
import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get } from "lodash";
import { FontIcon } from "react-md/lib";

import Dialog from "./DialogWrap";
import { removeScreen } from "../../actions/expoActions";

const ScreenDelete = ({ handleSubmit, dialogData }) => (
  <Dialog
    title={<FontIcon className="color-black">delete</FontIcon>}
    name="ScreenDelete"
    submitLabel="Smazat"
    handleSubmit={handleSubmit}
  >
    <p>
      Vybraná obrazovka <strong>{get(dialogData, "name")}</strong> bude smazána.
    </p>
    <p />
    <div className="flex-row-nowrap flex-center">
      <FontIcon className="color-red">priority_high</FontIcon>
      <p>
        <strong style={{ fontSize: "0.9em" }}>
          Akce je nevratná.{" "}
          {get(dialogData, "colNum") === 0 &&
          get(dialogData, "type") === "INTRO"
            ? `Smažete celou kategorii`
            : `Smažete pouze obrazovku`}
          , ale dokumenty a podklady zůstanou na serveru zachovány!
        </strong>
      </p>
    </div>
  </Dialog>
);

export default compose(
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      dispatch(removeScreen(props.dialogData.rowNum, props.dialogData.colNum));
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "screenDelete"
  })
)(ScreenDelete);
