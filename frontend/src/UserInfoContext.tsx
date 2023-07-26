import React, { useState, createContext, useContext,ReactNode, useEffect} from "react";
import { UserInfoI } from "./interface/userInfo_interface"

type UserContextValue = {
    userInfo: UserInfoI | null;
    setUser: (newUserInfo: UserInfoI) => void;
  };
  

const UserContext = createContext<UserContextValue |null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUserContext must be used within a UserContextProvider');
//   }
  return context;
}

export const UserContextProvider=({ children }: { children:any }) => {
  const [userInfo, setUserInfo] = useState<UserInfoI | null>(null);
  const setUser = (newUserInfo: UserInfoI) => {
    setUserInfo(newUserInfo);
  };
 
  //useEffect(()=>{setUserInfo(children.userInfo)}, [children])

  return (
    <UserContext.Provider  value={{ userInfo, setUser }}>{children}</UserContext.Provider>
  );
};
