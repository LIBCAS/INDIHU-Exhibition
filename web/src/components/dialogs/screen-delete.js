import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get } from "lodash";
import { FontIcon } from "react-md/lib";

import Dialog from "./dialog-wrap";
import { removeScreen } from "../../actions/expoActions";

// dialogData.name --> Screen Name
// dialogData.type --> Screen type
// dialogData.rowNum, dialogData.colNum
const ScreenDelete = ({ handleSubmit, dialogData }) => {
  if (!dialogData) {
    return null;
  }

  return (
    <Dialog
      title={<FontIcon className="color-black">delete</FontIcon>}
      name="ScreenDelete"
      submitLabel="Smazat"
      handleSubmit={handleSubmit}
    >
      {dialogData.type === "INTRO" && (
        <div className="flex flex-col gap-3">
          <p className='font-["Work_Sans"] !text-[16px]'>
            Obrazovka <span className="font-bold">Úvod do kapitoly</span> bude
            smazána.
          </p>
          <div className="flex gap-3">
            <FontIcon style={{ fontSize: "48px" }} className="color-red">
              priority_high
            </FontIcon>
            <p className='font-["Work_Sans"] !text-[16px]'>
              Pozor, smažete tím celou kapitolu. Akce je nevratná.
            </p>
          </div>
          <p className="mt-2 font-light">
            Dokumenty, podklady a soubory v editoru zůstanou.
          </p>
        </div>
      )}

      {dialogData.type !== "INTRO" && (
        <div>
          <p>
            Vybraná obrazovka <strong>{get(dialogData, "name")}</strong> bude
            smazána.
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
        </div>
      )}
    </Dialog>
  );
};

export default compose(
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      dispatch(removeScreen(props.dialogData.rowNum, props.dialogData.colNum));
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "screenDelete",
  })
)(ScreenDelete);
