import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

function TitleHome() {
  return (
    <>
      <div className="title-container">
        <h1>Онлайн хранилище паролей</h1>
      </div>
      <div className="buttons-action">
        <div className="button-array">
          <h1>Регистрация</h1>
          <Button title="Регистрация" as={Link} to="/register">
            &lArr;
          </Button>
        </div>
        <div className="paragraph">
          <p>
            Данный сайт предоставляет онлайн хранилище для паролей. Вся прелесть
            данного сайта в том что любой человек с любого устройства, которое
            имеет доступ к сети интернет, мог узнать когда-то давно записанный,
            забытый пароль.
          </p>
        </div>
        <div className="button-array">
          <h1>Авторизация</h1>
          <Button title="Авторизация" as={Link} to="/login">
            &rArr;
          </Button>
        </div>
      </div>
      <div className="mobile-title-page">
        <div className="title-mobile-container">
          <h1>Онлайн хранилище паролей</h1>
          <hr />
          <p>
            Данный сайт предоставляет онлайн хранилище для паролей. Вся прелесть
            данного сайта в том что любой человек с любого устройства, которое
            имеет доступ к сети интернет, мог узнать когда-то давно записанный,
            забытый пароль.
          </p>
        </div>
        <hr />

        <div className="button-mobile-container">
          <div className="button-mobile">
            <Button title="Регистрация" as={Link} to="/register">
              &lArr;
            </Button>
            <h4>Регистрация</h4>
          </div>
          <div className="button-mobile">
            <Button title="Регистрация" as={Link} to="/login">
              &rArr;
            </Button>
            <h4>Авторизация</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default TitleHome;
