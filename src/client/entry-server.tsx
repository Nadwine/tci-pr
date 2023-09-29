import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Root } from "./Root";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import initAxios from "../utils/initAxios";
import { Provider } from "react-redux";
import { store } from "./redux/store";

initAxios();

export function render(url: string) {
  return ReactDOMServer.renderToString(
    // TODO in production enable strict mode
    <StaticRouter location={url}>
      <Provider store={store}>
        <Root />
      </Provider>
    </StaticRouter>
  );
}
