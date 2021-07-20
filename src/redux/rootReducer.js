import { combineReducers } from "redux";
import { loadingReducer } from "./loadingReducer.js";
import { userReducer } from "./userReducer.js";

export const rootReducer = combineReducers({
  user: userReducer,
  loading: loadingReducer,
});
