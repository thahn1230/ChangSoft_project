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
      throw new Error("Authentication failed. Token has been removed.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API call failed with status ${response.status}: ${errorText}`
      );
    }

    return response;
  } catch (error) {
    console.error("Network error or connection refused:", error);
    throw new Error("Network error or connection refused.");
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
