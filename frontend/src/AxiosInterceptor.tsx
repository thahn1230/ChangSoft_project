import {useContext} from "react";
import axios, { AxiosRequestConfig } from "axios";
import { TokenContextProvider, useTokenContext } from "./TokenContext";

// function getTokenFromContext(): string {
//   const tokenContext = useTokenContext();
//   // Retrieve the token from your tokenContext here
//   if (tokenContext === null) return "";
//   const token = tokenContext.token; // Replace this with your actual token retrieval from context
//   if (token === null) return "";
//   return token;
// }

// Create a utility function to add the common data to the request
export function addTokenToRequest(
  config: AxiosRequestConfig
): AxiosRequestConfig {
const token="A"
//   console.log("token")
//   console.log(token)
//   // Add your additional data here
//   if (config.headers !== undefined) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//     // config.headers["Content-Type"] = "application/json";
//   }

  //just to check
//   if (config.url?.includes("construction_company_ratio")) {
//     console.log("config");
//     console.log(config);
//   }
  return config;
}

// Set the request interceptor to call the utility function before every request
// axios.interceptors.request.use(addTokenToRequest);

// Now, every axios.get or axios.post request will automatically have the common data added
