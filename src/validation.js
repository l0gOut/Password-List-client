export function validLogin(login) {
  return /[а-яё]|\s|\./gi.test(login) || /\d/.test(login[0]);
}
