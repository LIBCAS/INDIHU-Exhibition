import { DIALOG_SET, DIALOG_CLOSE, DIALOG_DATA_ADD } from "./constants";

export const setDialog = (name, data) => ({
  type: DIALOG_SET,
  payload: {
    name,
    data
  }
});

export const closeDialog = () => async dispatch => {
  document.body.style.overflow = "auto";
  dispatch({
    type: DIALOG_CLOSE,
    payload: {}
  });
};

export const addDialogData = (name, data) => ({
  type: DIALOG_DATA_ADD,
  payload: { name, data }
});
