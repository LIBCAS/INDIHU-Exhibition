import { reset } from "redux-form";

import {
  RADIO_STATE_CHANGE,
  SWITCH_STATE_CHANGE,
  APP,
  IMAGE_EDITOR,
  OAUTH_LOGIN,
} from "./constants";
import { ImageEditorProps, OAuthLoginResponse } from "reducers/app-reducer";

// loader: boolean value
export const showLoader = (loader: boolean) => ({
  type: APP,
  payload: { loader },
});

// state: string value, like "PREPARE" | "OPENED" | "ENDED" | "FOLDER_javascript"
export const changeRadioState = (state: any) => ({
  type: RADIO_STATE_CHANGE,
  payload: {
    radio: state,
  },
});

export const changeSwitchState = (state: any) => ({
  type: SWITCH_STATE_CHANGE,
  payload: {
    switchState: state,
  },
});

export const resetForm = (form: any) => reset(form);

export const setExpositionsScrollTop = (expositionsScrollTop: number) => ({
  type: APP,
  payload: {
    expositionsScrollTop,
  },
});

export const setImageEditor = (imageEditor: ImageEditorProps) => ({
  type: IMAGE_EDITOR,
  payload: {
    imageEditor,
  },
});

export const setOAuthLoginResponseType = (
  oAuthLoginResponse: OAuthLoginResponse
) => ({
  type: OAUTH_LOGIN,
  payload: { oAuthLoginResponse: oAuthLoginResponse },
});

export const clearOAuthLoginResponseType = () => ({
  type: OAUTH_LOGIN,
  payload: { oAuthLoginResponse: null },
});
