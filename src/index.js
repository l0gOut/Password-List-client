import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./css-reset.css";
import "semantic-ui-css/semantic.min.css";
import "react-notifications-component/dist/theme.css";
import { createStore, compose } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./redux/rootReducer";
import ReactNotification from "react-notifications-component";

const store = createStore(
  rootReducer,
  compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

ReactDOM.render(
  <Provider store={store}>
    <ReactNotification />
    <App />
  </Provider>,
  document.getElementById("root")
);
