import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Button,
  Dropdown,
  Icon,
  Modal,
  Loader,
} from "semantic-ui-react";
import {
  addPassword,
  initUser,
  loadingTrue,
  loadingFalse,
} from "../redux/actions.js";
import Password from "./Password.jsx";
import Cookie from "js-cookie";
import { reduceState } from "../redux/userReducer.js";
import { queryUrl, sendRequest, urlUser } from "../api/index.js";
import { store } from "react-notifications-component";

const nullPassword = {
  name: "",
  login: "",
  password: "",
  site: "",
};

function PasswordPage(props) {
  const [newPassword, setNewPassword] = useState(nullPassword);
  const [list, setList] = useState(props.user.passwordList);
  const [search, setSearch] = useState("");
  const [modalDelete, setModalDelete] = useState(false);
  const [modalPasswordDelete, setModalPasswordDelete] = useState("");

  // Я не знаю как это работает (здесь напрямую стейт редакса не изменяется но каким то магическим способом изменяется (он мутирует почему то...))
  // Я ВООБЩЕ НЕ ПОНИМАЮ КАК ЭТО РАБОТАЕТ В КОМПОНЕНТЕ PASSWORD Я ПЫТАЛСЯ СДЕЛАТЬ ТАК ЖЕ КАК И ТУТ НО НИЧЕГО НЕ ПОЛУЧИЛОСЬ А ТУТ ПОЛУЧИЛОСЬ ВОПРОС КААААААААААААК????
  function addPassword() {
    props.loadingTrue();
    setNewPassword(nullPassword);

    const user = {
      _id: props.user._id,
      login: props.user.login,
      password: props.user.password,
      passwordList: props.user.passwordList,
      __v: props.user.__v,
    };
    user.passwordList = [...user.passwordList, newPassword];

    sendRequest(
      queryUrl(`${urlUser}/${user._id}`, { type: "add-password" }),
      "PUT",
      user
    )
      .then(data => data.json().then(data => props.initUser(data.data[0])))
      .finally(() => props.loadingFalse());
  }

  function typingHandler(e, value, setValue) {
    setValue({ ...value, [e.target.name]: e.target.value });
  }

  function dropdownHandler(_, { value }) {
    switch (value) {
      case "exit":
        Cookie.remove("user");
        props.initUser(reduceState);
        break;
      case "delete":
        setModalDelete(true);
        break;
      default:
        return;
    }
  }

  async function deleteAccount() {
    try {
      sendRequest(`${urlUser}/${props.user._id}`, "DELETE", props.user);
      store.addNotification({
        message: "Аккаунт был удален успешно",
        type: "success",
        insert: "bottom",
        container: "bottom-right",
        dismiss: {
          duration: 2000,
          onScreen: true,
        },
      });
    } catch (err) {
      store.addNotification({
        message: "Произошла непредвиденная ошибка!",
        type: "danger",
        insert: "bottom",
        container: "bottom-right",
        dismiss: {
          duration: 2000,
          onScreen: true,
        },
      });
    } finally {
      Cookie.remove("user");
      props.initUser(reduceState);
    }
  }

  useEffect(() => {
    if (search)
      setList(
        props.user.passwordList.filter(data =>
          data.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    else setList(props.user.passwordList);
  }, [search, props.user.passwordList]);

  const trigger = (
    <span>
      <Icon name="user" />
      Приветствую, {props.user.login}
    </span>
  );

  const options = [
    {
      key: "user",
      text: (
        <span>
          Вы вошли как <strong>{props.user.login}</strong>
        </span>
      ),
    },
    { key: "sign-out", text: "Выйти", value: "exit" },
    { key: "delete-account", text: "Удалить аккаунт", value: "delete" },
  ];

  return (
    <div className="password-menu">
      <Modal
        className="modal-delete"
        size="mini"
        open={modalDelete}
        onClose={() => {
          setModalDelete(false);
          setModalPasswordDelete("");
        }}
      >
        <Modal.Header>
          Вы точно уверены?
          <Button
            title="Закрыть"
            onClick={() => {
              setModalDelete(false);
              setModalPasswordDelete("");
            }}
          >
            &#10006;
          </Button>
        </Modal.Header>
        <Modal.Content>
          <p>
            Введите пароль от <strong>своего аккаунта</strong> чтобы подтвердить
          </p>
          <Input
            value={modalPasswordDelete}
            type="password"
            onChange={e => setModalPasswordDelete(e.target.value)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            disabled={modalPasswordDelete !== props.user.password}
            onClick={deleteAccount}
          >
            Я уверен и хочу удалить аккаунт
          </Button>
        </Modal.Actions>
      </Modal>
      <div className="header">
        <Input
          className="block-search"
          placeholder="Поиск..."
          type="search"
          icon={<Icon className="search-icon" name="search" color="grey" />}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Dropdown
          className="dropdown-account"
          trigger={trigger}
          options={options}
          onChange={dropdownHandler}
          value
        />
      </div>
      <div className="create-password-container">
        <Form onSubmit={addPassword} className="create-password">
          <h1>Добавление пароля</h1>
          <Form.Field
            label="Название"
            name="name"
            control={Input}
            value={newPassword.name}
            onChange={e => typingHandler(e, newPassword, setNewPassword)}
            required
          />
          <Form.Field
            label="Логин или почта"
            name="login"
            control={Input}
            value={newPassword.login}
            onChange={e => typingHandler(e, newPassword, setNewPassword)}
            required
          />
          <Form.Field
            label="Пароль"
            name="password"
            type="password"
            control={Input}
            value={newPassword.password}
            onChange={e => typingHandler(e, newPassword, setNewPassword)}
            required
          />
          <Form.Field
            label="Ссылка на сайт"
            name="site"
            control={Input}
            value={newPassword.site}
            onChange={e => typingHandler(e, newPassword, setNewPassword)}
          />
          <Button type="submit">Добавить</Button>
        </Form>
      </div>
      <hr />
      <div className="container-password-block">
        {props.loading ? (
          <Loader active inline="centered" size="massive" />
        ) : list.length !== 0 ? (
          list.map(value => <Password pass={value} key={value._id} />)
        ) : (
          <h1 className="password-header">Список пуст</h1>
        )}
      </div>
    </div>
  );
}

const mapPropsToState = state => {
  return state;
};

const mapDispatchToProps = {
  addPassword,
  initUser,
  loadingTrue,
  loadingFalse,
};

export default connect(mapPropsToState, mapDispatchToProps)(PasswordPage);
