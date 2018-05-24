import { combineReducers } from "redux";

import { reducer as form } from "redux-form";

import app from "./appReducer";
import user from "./userReducer";
import dialog from "./dialogReducer";
import expo from "./expoReducer";
import file from "./fileReducer";
import admin from "./adminReducer";

export default combineReducers({
  form,
  app,
  user,
  dialog,
  expo,
  file,
  admin
});
