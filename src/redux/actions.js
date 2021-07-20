import {
  INIT,
  ADD_PASSWORD,
  DELETE_PASSWORD,
  UPDATE_PASSWORD,
  LOADING_TRUE,
  LOADING_FALSE,
} from "./types.js";

export function initUser(user) {
  return {
    type: INIT,
    payload: user,
  };
}

export function addPassword(password) {
  return {
    type: ADD_PASSWORD,
    payload: password,
  };
}

export function deletePassword(password) {
  return {
    type: DELETE_PASSWORD,
    payload: password,
  };
}

export function updatePassword(password) {
  return {
    type: UPDATE_PASSWORD,
    payload: password,
  };
}

export function loadingTrue() {
  return {
    type: LOADING_TRUE,
  };
}

export function loadingFalse() {
  return {
    type: LOADING_FALSE,
  };
}
