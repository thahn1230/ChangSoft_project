const BASE_URL = process.env.REACT_APP_API_URL as string;

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

const fetchApi = async (url: string, options: FetchOptions = {}) => {
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  });

  if (options.auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}/${url}`, { ...options, headers });

    if (response.status === 401) {
      localStorage.removeItem("token");
    }

    return response;
  } catch (error) {
    // 네트워크 오류나 연결 거부

    throw error;
  }
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