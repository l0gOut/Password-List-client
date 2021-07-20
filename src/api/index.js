export const urlUser = `http://${window.location.hostname}:5000/user`;

export function queryUrl(url, queryObject) {
  return `${url}?${new URLSearchParams(queryObject)}`;
}

export async function sendRequest(url, method = "GET", body = null) {
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  return new Promise((resolve, reject) => {
    if (res.status >= 400) {
      reject(res);
    } else {
      resolve(res);
    }
  });
}
