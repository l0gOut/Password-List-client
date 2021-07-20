import {
  INIT,
  CREATE_USER,
  ADD_PASSWORD,
  DELETE_PASSWORD,
  UPDATE_PASSWORD,
} from "./types.js";

export const reduceState = {
  _id: "",
  login: "",
  password: "",
  passwordList: [{ _id: "", name: "", login: "", password: "", site: "" }],
};

export function userReducer(state = reduceState, action) {
  switch (action.type) {
    case INIT:
      return action.payload;
    case CREATE_USER:
      return action.payload;
    case ADD_PASSWORD:
      return {
        ...state,
        passwordList: [...state.passwordList, action.payload],
      };
    case DELETE_PASSWORD:
      return {
        ...state,
        passwordList: [
          ...state.passwordList.filter(data => data._id !== action.payload._id),
        ],
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
        passwordList: action.payload.passwordList,
      };
    default:
      return state;
  }
}
