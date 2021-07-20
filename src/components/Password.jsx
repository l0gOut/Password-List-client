import React, { useState } from "react";
import { Button, Modal, Input, Message } from "semantic-ui-react";
import copy from "copy-to-clipboard";
import { store } from "react-notifications-component";
import { queryUrl, sendRequest, urlUser } from "../api/index.js";
import { connect } from "react-redux";
import {
  deletePassword,
  updatePassword,
  loadingTrue,
  loadingFalse,
} from "../redux/actions.js";

function Password(props) {
  const [modalDelete, setModalDelete] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDeleteValue, setModalDeleteValue] = useState("");
  const [modalUpdateValue, setModalUpdateValue] = useState(props.pass);
  const [accountPassword, setAccountPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  function typingHandler(e) {
    setModalUpdateValue({
      ...modalUpdateValue,
      [e.target.name]: e.target.value,
    });
  }

  function updatePassword(password) {
    props.loadingTrue();

    const user = props.user;
    user.passwordList.splice(
      user.passwordList.findIndex(value => value._id === password._id),
      1,
      modalUpdateValue
    );

    sendRequest(
      queryUrl(`${urlUser}/${props.user._id}`, { type: "update-password" }),
      "PUT",
      user
    )
      .then(data =>
        data.json().then(data => props.updatePassword(data.data[0]))
      )
      .finally(() => props.loadingFalse());

    setModalUpdate(false);
    setAccountPassword("");

    store.addNotification({
      message: "Пароль был изменен!",
      type: "success",
      insert: "bottom",
      container: "bottom-right",
      dismiss: {
        duration: 2000,
        onScreen: true,
      },
    });
  }

  function deletePassword(password) {
    props.loadingTrue();

    const user = props.user;
    user.passwordList.splice(
      user.passwordList.findIndex(value => value._id === password._id)
    );
    sendRequest(
      queryUrl(`${urlUser}/${props.user._id}`, { type: "delete-password" }),
      "PUT",
      props.user
    ).finally(() => {
      props.deletePassword(password);

      props.loadingFalse();
    });

    setModalDelete(false);
    setModalDeleteValue("");
    store.addNotification({
      message: "Пароль был удален успешно!",
      type: "success",
      insert: "bottom",
      container: "bottom-right",
      dismiss: {
        duration: 2000,
        onScreen: true,
      },
    });
  }

  return (
    <div className="password-block">
      <Modal
        className="modal-delete"
        size="mini"
        open={modalDelete}
        onClose={() => {
          setModalDelete(false);
          setModalDeleteValue("");
        }}
      >
        <Modal.Header>
          Вы точно уверены?{" "}
          <Button
            title="Закрыть"
            onClick={() => {
              setModalDelete(false);
              setModalDeleteValue("");
            }}
          >
            &#10006;
          </Button>
        </Modal.Header>
        <Modal.Content>
          <p>
            Введите <strong>{props.pass.name}</strong> чтобы подтвердить
          </p>
          <Input
            value={modalDeleteValue}
            onChange={e => setModalDeleteValue(e.target.value)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            disabled={props.pass.name !== modalDeleteValue}
            onClick={() => deletePassword(props.pass)}
          >
            Удалить пароль
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal
        className="modal-update"
        size="tiny"
        open={modalUpdate}
        onOpen={() => setModalUpdateValue(props.pass)}
        onClose={() => {
          setModalUpdate(false);
          setAccountPassword("");
        }}
      >
        <Modal.Header>
          Изменение блока с паролем
          <Button title="Закрыть" onClick={() => setModalUpdate(false)}>
            &#10006;
          </Button>
        </Modal.Header>
        <Modal.Content>
          <p>
            Подтвердите изменение написав сюда{" "}
            <strong>пароль от аккаунта</strong>
          </p>
          <Input
            type="password"
            value={accountPassword}
            onChange={e => setAccountPassword(e.target.value)}
            onFocus={() => setErrorPassword("")}
            onBlur={() => {
              if (accountPassword === props.user.password) setErrorPassword("");
              else setErrorPassword("Неверный пароль!");
            }}
          />
          <Message negative hidden={errorPassword.length === 0}>
            {errorPassword}
          </Message>
        </Modal.Content>
        <hr />
        <Modal.Content>
          <p>Новое имя</p>
          <Input
            name="name"
            value={modalUpdateValue.name}
            onChange={typingHandler}
          />
          <p>Новый логин</p>
          <Input
            name="login"
            value={modalUpdateValue.login}
            onChange={typingHandler}
          />
          <p>Новый пароль</p>
          <Input
            type="password"
            name="password"
            value={modalUpdateValue.password}
            onChange={typingHandler}
          />
          <p>Новая ссылка</p>
          <Input
            name="site"
            value={modalUpdateValue.site}
            onChange={typingHandler}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            disabled={
              accountPassword !== props.user.password ||
              JSON.stringify(props.pass) === JSON.stringify(modalUpdateValue)
            }
            onClick={() => updatePassword(props.pass)}
          >
            Изменить
          </Button>
        </Modal.Actions>
      </Modal>
      <div className="password-block-header">
        <h2>{props.pass.name}</h2>
        <Button title="Удалить" onClick={() => setModalDelete(true)}>
          &#10006;
        </Button>
      </div>
      <div className="password-info">
        <div className="password-info-block">
          <div className="login">
            Логин:
            <p
              title={props.pass.login}
              onClick={() => {
                copy(props.pass.login);
                store.addNotification({
                  message: "Логин скопирован успешно!",
                  type: "success",
                  insert: "bottom",
                  container: "bottom-right",
                  dismiss: {
                    duration: 2000,
                    onScreen: true,
                  },
                });
              }}
            >
              {props.pass.login.length >= 25
                ? `${props.pass.login.substring(0, 25)}...`
                : props.pass.login}
            </p>
          </div>
        </div>
        <div className="password-info-block">
          <div className="password">
            Пароль:
            <p
              title="Кликните что-бы сохранить!"
              onClick={() => {
                copy(props.pass.password);
                store.addNotification({
                  message: "Пароль скопирован успешно!",
                  type: "success",
                  insert: "bottom",
                  container: "bottom-right",
                  dismiss: {
                    duration: 2000,
                    onScreen: true,
                  },
                });
              }}
            >
              {props.pass.password.length >= 20
                ? props.pass.password.substring(0, 20).replace(/./gi, "•")
                : props.pass.password.replace(/./gi, "•")}
            </p>
          </div>
        </div>
        {props.pass.site ? (
          <div className="password-info-block">
            <div>
              Ссылка на сайт:{" "}
              <a title={props.pass.site} href={props.pass.site} target="_">
                {props.pass.site.length >= 15
                  ? `${props.pass.site.substring(0, 15)}...`
                  : props.pass.site}
              </a>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="password-update-button">
        <Button
          className="password-update-button"
          onClick={() => setModalUpdate(true)}
        >
          Изменить
        </Button>
      </div>
    </div>
  );
}

const mapPropsToState = state => {
  return state;
};

const mapDispatchToProps = {
  deletePassword,
  updatePassword,
  loadingTrue,
  loadingFalse,
};

export default connect(mapPropsToState, mapDispatchToProps)(Password);
