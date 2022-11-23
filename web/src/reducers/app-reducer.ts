import { Reducer } from "redux";
import {
  RADIO_STATE_CHANGE,
  SWITCH_STATE_CHANGE,
  MOUSE_ACTUALIZE,
  ZOOM_ACTUALIZE,
  ZOOM_ACTUALIZE_2,
  ZOOM_ACTUALIZE_3,
  APP,
  IMAGE_EDITOR,
} from "../actions/constants";

export type MouseInfo = {
  mouseDown: boolean;
  mouseClicked: boolean;
  mouseXPos: number | null;
  mouseYPos: number | null;
  correlationX: number | null;
  correlationY: number | null;
};

export type ImageEditorProps = {
  expoId: string;
  folder: any;
  src: string;
  type?: string;
  onClose: () => void;
};

export type AppReducerState = {
  loader: boolean;
  radio: string | null;
  switchState: boolean;
  mouseInfo: MouseInfo;
  zoom: number;
  zoom2: number;
  zoom3: number;
  timeout: NodeJS.Timeout | null;
  expositionsScrollTop: number;
  imageEditor: ImageEditorProps | null;
};

const initialState: AppReducerState = {
  loader: false,
  radio: null,
  switchState: true,
  mouseInfo: {
    mouseDown: false,
    mouseClicked: false,
    mouseXPos: null,
    mouseYPos: null,
    correlationX: null,
    correlationY: null,
  },
  zoom: 100,
  zoom2: 100,
  zoom3: 100,
  timeout: null,
  expositionsScrollTop: 0,
  imageEditor: null,
};

const reducer: Reducer<AppReducerState> = (state = initialState, action) => {
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
    case IMAGE_EDITOR:
      return { ...state, ...action.payload };
    case APP:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
