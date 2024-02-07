import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "@progress/kendo-theme-default/dist/all.css";
import { BrowserRouter } from "react-router-dom";

const isStrictModeEnabled = process.env.REACT_APP_STRICT_MODE === 'true';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

root.render(
  isStrictModeEnabled ? (
    <React.StrictMode>{app}</React.StrictMode>
  ) : (
    app
  )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
