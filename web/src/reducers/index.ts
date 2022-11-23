import { combineReducers } from "redux";

import { reducer as form, FormStateMap } from "redux-form";

import app, { AppReducerState } from "./app-reducer";
import user from "./user-reducer";
import dialog, { DialogReducerState } from "./dialog-reducer";
import expo, { ExpoReducerState } from "./expo-reducer";
import file from "./file-reducer";
import admin from "./admin-reducer";

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
  form,
  app,
  user,
  dialog,
  expo,
  file,
  admin,
});
