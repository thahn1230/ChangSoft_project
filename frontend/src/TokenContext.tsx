import React, { useState, createContext, useContext } from "react";
import axios, { AxiosRequestConfig } from "axios";

type TokenContextValue = {
  token: string | null;
  setToken: (newToken: string | null) => void;
};

export const TokenContext = createContext<TokenContextValue | null>(null);

export function useTokenContext() {
  const context = useContext(TokenContext);
  //   if (!context) {
  //     throw new Error('useUserContext must be used within a UserContextProvider');
  //   }
  return context;
}

export const TokenContextProvider = ({ children }: { children: any }) => {
  const [token, setToken] = useState<string | null>(null);
  // const setUser = (newUserInfo: UserInfoI) => {
  //   setUserInfo(newUserInfo);
  // };

  // useEffect(() => {
  //   console.log("children : ")
  //   console.log(children)
  //   setUserInfo(children.userInfo);
  // }, [children]);

  return (
    <TokenContext.Provider value={{ token: token, setToken: setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export function addTokenToRequest(
  config: AxiosRequestConfig, token:string|null|undefined
): AxiosRequestConfig {


  // Add your additional data here
  if (config.headers !== undefined) {
    config.headers["Authorization"] = `Bearer ${token}`;
    // config.headers["Content-Type"] = "application/json";
  }

  //just to check
  if (config.url?.includes("construction_company_ratio")) {
    console.log("config in construction company ratio");
    console.log(config);
  }
  return config;
}
