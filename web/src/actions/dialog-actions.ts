import { DIALOG_SET, DIALOG_CLOSE, DIALOG_DATA_ADD } from "./constants";

import { DialogDataType, DialogType } from "components/dialogs/dialog-types";
import { Dispatch } from "redux";

export const setDialog = <T extends DialogType>(
  name: T,
  data: DialogDataType<T>
) => ({
  type: DIALOG_SET,
  payload: {
    name,
    data,
  },
});

export const closeDialog = () => async (dispatch: Dispatch<unknown>) => {
  document.body.style.overflow = "auto";
  dispatch({
    type: DIALOG_CLOSE,
    payload: {},
  });
};

export const addDialogData = <T extends DialogType>(
  name: T,
  data: Partial<DialogDataType<T>>
) => ({
  type: DIALOG_DATA_ADD,
  payload: { name, data },
});
