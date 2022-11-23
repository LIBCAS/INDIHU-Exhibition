import { TAB_FOLDER, TAB_FILE } from "../actions/constants";

const initialState = {
  folder: null,
  file: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TAB_FOLDER:
      return { ...state, ...action.payload };
    case TAB_FILE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
