import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "semantic-ui-react";
import { sendRequest, urlUser } from "../api";
import { initUser } from "../redux/actions.js";
import Cookie from "js-cookie";
import { validLogin } from "../validation";

// Чистит стейт данных вводимых пользователем
const nullReg = {
  login: "",
  password: "",
  currentPassword: "",
};

// Чистит стейт ошибок
const error = {
  login: "",
  password: "",
  currentPassword: "",
};

function RegistrationPage() {
  const [reg, setReg] = useState(nullReg); // Вводимые данные пользователем
  const [errorText, setErrorText] = useState(error); // Для ошибок
  const [checkbox, setCheckbox] = useState(false); // Состояние чекбокса
  const [loading, setLoading] = useState(false); // Анимация загрузки
  const history = useHistory(); // Перенаправление после регистрации

  // Изменяет стейт
  function typingHandler(e) {
    setReg({ ...reg, [e.target.name]: e.target.value });
    setErrorText(error); // Очищает стейт ошибок при набирании
  }

  // Изменяет состояние чекбокса
  function toggleCheckbox() {
    setCheckbox(!checkbox);
  }

  // Регистрация
  async function registrationUser(value) {
    // несовпадение паролей
    if (value.password !== value.currentPassword) {
      setErrorText({
        ...errorText,
        password: "Пароль не совпадает",
        currentPassword: "Пароль не совпадает",
      });
      return;
    }

    // Валидация
    if (validLogin(value.login)) {
      setErrorText({
        ...errorText,
        login:
          "Вводите только латиницу с цифрами! Пример: Dima2, Anna_21 и т.д...",
      });
      return;
    }

    setLoading(true);

    // Регистрация пользователя если все прошло успешно. При ошибке меняет стейт ошибок и при любом раскладе завершает анимацию загрузки
    try {
      const response = await sendRequest(urlUser, "POST", value);

      const user = await response.json();

      // Создание куки
      if (checkbox) Cookie.set("user", user.data, { expires: 31 });
      else Cookie.set("user", user.data);

      setLoading(false);

      // Очищение стейтов
      setCheckbox(false);
      setReg(nullReg);

      history.push("/home");
    } catch (err) {
      setLoading(false);
      const messageRes = await await err.json();
      setErrorText({ ...errorText, login: messageRes.message });
    }
  }

  return (
    <>
      <div className="container-title-page">
        <div className="button-array">
          <h1>Авторизация</h1>
          <Button title="Авторизация" as={Link} to="/login">
            &lArr;
          </Button>
        </div>
        <div className="container-form">
          <h1>Окно Регистрации</h1>
          <Form
            className="reg"
            onSubmit={() => registrationUser(reg)}
            loading={loading}
          >
            <Form.Field
              type="text"
              label="Логин"
              placeholder="Логин..."
              minLength="4"
              name="login"
              control={Input}
              value={reg.login}
              onChange={typingHandler}
              error={errorText.login ? errorText.login : null}
              required
            />
            <Form.Field
              type="password"
              label="Пароль"
              placeholder="Пароль..."
              minLength="4"
              name="password"
              control={Input}
              value={reg.password}
              onChange={typingHandler}
              error={errorText.password ? errorText.password : null}
              required
            />
            <Form.Field
              type="password"
              label="Повторите пароль"
              placeholder="Повторите пароль..."
              minLength="4"
              name="currentPassword"
              control={Input}
              value={reg.currentPassword}
              onChange={typingHandler}
              error={
                errorText.currentPassword ? errorText.currentPassword : null
              }
              required
            />
            <Checkbox
              label="Запомнить меня"
              checked={checkbox}
              onChange={toggleCheckbox}
            />
            <Button type="submit">Зарегистрироваться</Button>
          </Form>
        </div>
        <div className="button-array">
          <h1>Главная</h1>
          <Button title="Главная" as={Link} to="/">
            &rArr;
          </Button>
        </div>
      </div>
      <div className="phone-button-container">
        <div className="phone-button">
          <Button title="Авторизация" as={Link} to="/login">
            &lArr;
          </Button>
          <h4>Авторизация</h4>
        </div>
        <div className="phone-button">
          <Button title="Главная" as={Link} to="/">
            &rArr;
          </Button>
          <h4>Главная</h4>
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = {
  initUser,
};

export default connect(null, mapDispatchToProps)(RegistrationPage);
