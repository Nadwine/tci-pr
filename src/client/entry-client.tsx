import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Root } from "./Root";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import initAxios from "../utils/initAxios";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "../utils/initializeExtensions";

initAxios();

const container = document.getElementById("app");

const FullApp = () => (
  // TODO in production enable strict mode
  <BrowserRouter>
    <Provider store={store}>
      <Root />
    </Provider>
  </BrowserRouter>
);

if (import.meta.hot || !container?.innerText) {
  const root = createRoot(container!);
  root.render(<FullApp />);
} else {
  hydrateRoot(container!, <FullApp />);
}
