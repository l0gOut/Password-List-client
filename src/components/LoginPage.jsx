import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Form, Input, Button, Checkbox, Message } from "semantic-ui-react";
import { queryUrl, sendRequest, urlUser } from "../api/index.js";
import { initUser } from "../redux/actions.js";
import { validLogin } from "../validation.js";
import Cookie from "js-cookie";

const log = {
  login: "",
  password: "",
};

function LoginPage() {
  const [login, setLogin] = useState(log);
  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function typingHandler(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
    setError("");
  }

  function toggleCheckbox() {
    setCheckbox(!checkbox);
  }

  async function loginUser(value) {
    setMessageError("");

    if (validLogin(value.login)) {
      setError(
        "Вводите только латиницу с цифрами! Пример: Dima2, Anna_21 и т.д..."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await sendRequest(queryUrl(urlUser, login));

      const user = await response.json();

      const loginPassword = {
        login: user[0].login,
        password: user[0].password,
      };
      if (checkbox) Cookie.set("user", loginPassword, { expires: 31 });
      else Cookie.set("user", loginPassword);

      setLoading(false);
      setLogin(log);

      history.push("/home");
    } catch (err) {
      setLoading(false);
      setLogin(log);
      const response = await err.json();
      setMessageError(response.message);
    }
  }

  return (
    <>
      <div className="container-title-page">
        <div className="button-array">
          <h1>Главная</h1>
          <Button title="Главная" as={Link} to="/">
            &lArr;
          </Button>
        </div>
        <div className="container-form">
          <h1>Окно Авторизации</h1>
          <Form
            className="log"
            onSubmit={() => loginUser(login)}
            loading={loading}
          >
            <Form.Field
              control={Input}
              type="text"
              name="login"
              label="Логин"
              placeholder="Логин..."
              minLength="4"
              value={login.login}
              onChange={typingHandler}
              error={error ? error : null}
              required
            />
            <Form.Field
              control={Input}
              type="password"
              name="password"
              label="Пароль"
              placeholder="Пароль..."
              minLength="4"
              value={login.password}
              onChange={typingHandler}
              required
            />
            <Checkbox
              label="Запомнить меня"
              checked={checkbox}
              onChange={toggleCheckbox}
            />
            <Button type="submit">Войти</Button>
            <Message negative hidden={messageError ? false : true}>
              {messageError}
            </Message>
          </Form>
        </div>
        <div className="button-array">
          <h1>Регистрация</h1>
          <Button title="Регистрация" as={Link} to="/register">
            &rArr;
          </Button>
        </div>
      </div>
      <div className="phone-button-container">
        <div className="phone-button">
          <Button title="Главная" as={Link} to="/">
            &lArr;
          </Button>
          <h4>Главная</h4>
        </div>
        <div className="phone-button">
          <Button title="Регистрация" as={Link} to="/register">
            &rArr;
          </Button>
          <h4>Регистрация</h4>
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = {
  initUser,
};

export default connect(null, mapDispatchToProps)(LoginPage);
