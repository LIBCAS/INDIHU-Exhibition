import { Reducer } from "redux";
import {
  RADIO_STATE_CHANGE,
  SWITCH_STATE_CHANGE,
  APP,
  IMAGE_EDITOR,
  OAUTH_LOGIN,
} from "../actions/constants";

export type OAuthLoginResponse = {
  providerName: string;
  oAuthResponseType:
    | "waitingForAdminAccept" // 201
    | "stillNotAcceptedError" // 412
    | "publicEmailError" // 400
    | "otherError" // other error
    | "missingProviderNameUrlParam"
    | "missingProviderCodeUrlQuery"
    | null; // cleared after 200 or no login was performed yet
} | null;

export type ImageEditorProps = {
  expoId: string;
  src: string;
  type?: string;
  folder?: any;
  onClose?: () => void;
};

export type AppReducerState = {
  loader: boolean;
  radio: string | null;
  switchState: boolean;
  expositionsScrollTop: number;
  imageEditor: ImageEditorProps | null;
  oAuthLoginResponse: OAuthLoginResponse;
};

const initialState: AppReducerState = {
  loader: false,
  radio: null,
  switchState: true,
  expositionsScrollTop: 0,
  imageEditor: null,
  oAuthLoginResponse: null,
};

const reducer: Reducer<AppReducerState> = (state = initialState, action) => {
  switch (action.type) {
    case RADIO_STATE_CHANGE:
      return { ...state, ...action.payload };
    case SWITCH_STATE_CHANGE:
      return { ...state, ...action.payload };
    case IMAGE_EDITOR:
      return { ...state, ...action.payload };
    case APP:
      return { ...state, ...action.payload };
    case OAUTH_LOGIN:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
