const BASE_URL = process.env.REACT_APP_API_URL;

const fetchApi = (url, options = {}) => {
  // 기본 헤더
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 인증이 필요한 경우 (회원가입 제외 필수)
  if (options.auth) {
    const token = localStorage.getItem("token");
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}/${url}`, { ...options, headers });
};

export const get = (url, auth = false) => {
  return fetchApi(url, {
    method: "GET",
    auth,
  });
};

export const post = (url, data, auth = false) => {
  return fetchApi(url, {
    method: "POST",
    body: JSON.stringify(data),
    auth,
  });
};

export default { get, post };