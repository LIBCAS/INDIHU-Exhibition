import { reset } from "redux-form";

import {
  LOADER,
  RADIO_STATE_CHANGE,
  SWITCH_STATE_CHANGE,
  MOUSE_ACTUALIZE,
  ZOOM_ACTUALIZE,
  ZOOM_ACTUALIZE_2,
  ZOOM_ACTUALIZE_3,
  APP
} from "./constants";

export const showLoader = bool => ({
  type: LOADER,
  payload: { loader: bool }
});

export const changeRadioState = state => ({
  type: RADIO_STATE_CHANGE,
  payload: {
    radio: state
  }
});

export const changeSwitchState = state => ({
  type: SWITCH_STATE_CHANGE,
  payload: {
    switchState: state
  }
});

export const resetForm = form => reset(form);

export const mouseActualize = mouseInfo => ({
  type: MOUSE_ACTUALIZE,
  payload: mouseInfo
});

export const zoomActualize = zoom => ({
  type: ZOOM_ACTUALIZE,
  payload: {
    zoom
  }
});

export const zoomActualize2 = zoom2 => ({
  type: ZOOM_ACTUALIZE_2,
  payload: {
    zoom2
  }
});

export const zoomActualize3 = zoom3 => ({
  type: ZOOM_ACTUALIZE_3,
  payload: {
    zoom3
  }
});

export const setTimeoutId = timeout => ({
  type: APP,
  payload: {
    timeout
  }
});
