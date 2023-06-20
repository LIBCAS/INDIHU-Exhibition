import { combineReducers } from "redux";

// Reducers and their types, if are defined
import { reducer as formReducer, FormStateMap } from "redux-form";
import appReducer, { AppReducerState } from "./app-reducer";
import userReducer from "./user-reducer";
import dialogReducer, { DialogReducerState } from "./dialog-reducer";

import expoReducer, { ExpoReducerState } from "./expo-reducer";
import fileReducer from "./file-reducer";
import adminReducer from "./admin-reducer";

type RootReducerType = {
  form: FormStateMap;
  app: AppReducerState;
  user: any;
  dialog: DialogReducerState;
  expo: ExpoReducerState;
  file: any;
  admin: any;
};

export default combineReducers<RootReducerType>({
  form: formReducer,
  app: appReducer,
  user: userReducer,
  dialog: dialogReducer,
  expo: expoReducer,
  file: fileReducer,
  admin: adminReducer,
});
