import { ADMIN } from "../actions/constants";

const initialState = {
  settings: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
