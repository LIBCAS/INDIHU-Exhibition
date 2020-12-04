import {
  RADIO_STATE_CHANGE,
  SWITCH_STATE_CHANGE,
  MOUSE_ACTUALIZE,
  ZOOM_ACTUALIZE,
  ZOOM_ACTUALIZE_2,
  ZOOM_ACTUALIZE_3,
  APP
} from "../actions/constants";

const initialState = {
  loader: false,
  radio: null,
  switchState: true,
  mouseInfo: {
    mouseDown: false,
    mouseClicked: false,
    mouseXPos: null,
    mouseYPos: null,
    correlationX: null,
    correlationY: null
  },
  zoom: 100,
  zoom2: 100,
  zoom3: 100,
  timeout: null,
  expositionsScrollTop: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RADIO_STATE_CHANGE:
      return { ...state, ...action.payload };
    case SWITCH_STATE_CHANGE:
      return { ...state, ...action.payload };
    case MOUSE_ACTUALIZE:
      return { ...state, mouseInfo: { ...state.mouseInfo, ...action.payload } };
    case ZOOM_ACTUALIZE:
      return { ...state, ...action.payload };
    case ZOOM_ACTUALIZE_2:
      return { ...state, ...action.payload };
    case ZOOM_ACTUALIZE_3:
      return { ...state, ...action.payload };
    case APP:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
