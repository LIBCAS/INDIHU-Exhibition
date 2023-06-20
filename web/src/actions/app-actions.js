import { reset } from "redux-form";

import {
  RADIO_STATE_CHANGE,
  SWITCH_STATE_CHANGE,
  MOUSE_ACTUALIZE,
  ZOOM_ACTUALIZE,
  ZOOM_ACTUALIZE_2,
  ZOOM_ACTUALIZE_3,
  APP,
  IMAGE_EDITOR,
} from "./constants";

// loader: boolean value
export const showLoader = (loader) => ({
  type: APP,
  payload: { loader },
});

// state: string value, like "PREPARE" | "OPENED" | "ENDED" | "FOLDER_javascript"
export const changeRadioState = (state) => ({
  type: RADIO_STATE_CHANGE,
  payload: {
    radio: state,
  },
});

export const changeSwitchState = (state) => ({
  type: SWITCH_STATE_CHANGE,
  payload: {
    switchState: state,
  },
});

export const resetForm = (form) => reset(form);

// Used in image.js
export const mouseActualize = (mouseInfo) => ({
  type: MOUSE_ACTUALIZE,
  payload: mouseInfo,
});

// Used in image.js
export const zoomActualize = (zoom) => ({
  type: ZOOM_ACTUALIZE,
  payload: {
    zoom,
  },
});

export const zoomActualize2 = (zoom2) => ({
  type: ZOOM_ACTUALIZE_2,
  payload: {
    zoom2,
  },
});

export const zoomActualize3 = (zoom3) => ({
  type: ZOOM_ACTUALIZE_3,
  payload: {
    zoom3,
  },
});

export const setTimeoutId = (timeout) => ({
  type: APP,
  payload: {
    timeout,
  },
});

export const setExpositionsScrollTop = (expositionsScrollTop) => ({
  type: APP,
  payload: {
    expositionsScrollTop,
  },
});

export const setImageEditor = (imageEditor) => ({
  type: IMAGE_EDITOR,
  payload: {
    imageEditor,
  },
});
