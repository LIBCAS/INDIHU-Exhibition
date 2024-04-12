import { DialogType } from "components/dialogs/dialog-types";
import { map } from "lodash";
import { Reducer } from "redux";

import {
  DIALOG_SET,
  DIALOG_CLOSE,
  DIALOG_DATA_ADD,
} from "../actions/constants";

export type DialogReducerState = {
  dialogs: { name: DialogType; data: any }[];
  name: DialogType | null;
  data: any;
};

const initialState: DialogReducerState = {
  dialogs: [],
  name: null,
  data: null,
};

const reducer: Reducer<DialogReducerState> = (state = initialState, action) => {
  switch (action.type) {
    case DIALOG_SET:
      return {
        ...state,
        name: action.payload.name,
        data: action.payload.data,
        dialogs: [...state.dialogs, action.payload],
      };
    case DIALOG_CLOSE:
      state.dialogs.splice(-1, 1);
      return {
        ...state,
        name: !state.dialogs.length
          ? null
          : state.dialogs[state.dialogs.length - 1].name,
        data: !state.dialogs.length
          ? null
          : state.dialogs[state.dialogs.length - 1].data,
      };
    case DIALOG_DATA_ADD:
      return {
        ...state,
        data:
          state.name === action.payload.name
            ? { ...state.data, ...action.payload.data }
            : state.data,
        dialogs: map(state.dialogs, (d) =>
          d.name === action.payload.name
            ? { ...d, data: { ...d.data, ...action.payload.data } }
            : d
        ),
      };
    default:
      return state;
  }
};

export default reducer;
