import React from "react";
import { Switch, Route, BrowserRouter, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { initUser } from "./redux/actions.js";
import PasswordPage from "./components/PasswordPage";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import TitleHome from "./components/TitleHome";
import Cookie from "js-cookie";
import { queryUrl, sendRequest, urlUser } from "./api/index.js";

import "./style.css";

function App(props) {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Password
            exact
            path="/home"
            component={PasswordPage}
            initUser={props.initUser}
            user={props.user}
          />
          <Title path="/" initUser={props.initUser} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

function Password({
  user,
  initUser: createUser,
  component: Component,
  ...rest
}) {
  const cookieUser = Cookie.get("user");

  const history = useHistory();

  // Если кука пуста то перебрасывает на главную
  if (!cookieUser) {
    history.push("/");
  } else {
    if (!user._id) {
      try {
        sendRequest(queryUrl(urlUser, JSON.parse(cookieUser)))
          .then(data => data.json().then(data => createUser(data[0])))
          .catch(() => {
            Cookie.remove("user");
            history.push("/");
          });
      } catch (_) {
        Cookie.remove("user");
        history.push("/");
      }
    } else {
      return <Route {...rest} component={Component} />;
    }
  }
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

function Title({ initUser: createUser, ...rest }) {
  const user = Cookie.get("user");

  const history = useHistory();

  if (user) {
    history.push("/home");
  }

  return (
    <Route {...rest}>
      <div className="main">
        <Route exact path="/" component={TitleHome} />
        <Route exact path="/register" component={RegistrationPage} />
        <Route exact path="/login" component={LoginPage} />
      </div>
    </Route>
  );
}

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
  initUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
