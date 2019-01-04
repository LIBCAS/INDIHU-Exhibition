import React from "react";
import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get } from "lodash";
import Dialog from "./DialogWrap";
import { removeScreen } from "../../actions/expoActions";

const ScreenDelete = ({ handleSubmit, dialogData }) =>
  <Dialog
    title="Smazání obrazovky"
    name="ScreenDelete"
    submitLabel="Smazat"
    handleSubmit={handleSubmit}
  >
    <p>
      Vybraná obrazovka <strong>{get(dialogData, "name")}</strong> bude smazána.
    </p>
    <p>
      Tato operace je nevratná a
      {get(dialogData, "colNum") === 0 && get(dialogData, "type") === "INTRO"
        ? <strong> smaže celou kategorii! </strong>
        : <span> smaže pouze obrazovku. </span>}
      Dokumenty a podklady zůstanou na serveru zachovány!
    </p>
  </Dialog>;

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
