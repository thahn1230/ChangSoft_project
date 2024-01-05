const BASE_URL = process.env.REACT_APP_API_URL as string;

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

const fetchApi = (url: string, options: FetchOptions = {}) => {
  // 기본 헤더
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  });

  // 인증이 필요한 경우 (회원가입 제외 필수)
  if (options.auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
  }

  return fetch(`${BASE_URL}/${url}`, { ...options, headers });
};

export const get = (url: string, auth: boolean = false) => {
  return fetchApi(url, {
    method: "GET",
    auth,
  });
};

export const post = (url: string, data: any, auth: boolean = false) => {
  return fetchApi(url, {
    method: "POST",
    body: JSON.stringify(data),
    auth,
  });
};

export default { get, post };