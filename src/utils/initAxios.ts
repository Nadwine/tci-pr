// @ts-nocheck
import axios, { AxiosError, AxiosRequestConfig, AxiosRequestTransformer, AxiosResponse } from "axios";
import React from "react";
import { toast } from "react-toastify";
import JsonView from "@uiw/react-json-view";

// https://lifesaver.codes/answer/need-some-advice-about-handling-302-redirects-from-ajax
export default function initAxios() {
  axios.defaults.withCredentials = true;

  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.data?.redirect) {
        window.location = response.data.redirect;
        return;
      }
      return response;
    },
    (error: AxiosError) => {
      // handle a successfull login separately (coming in as an error because axios only recognizes status 200 as success callback)
      // if (error.response && error.response.data && error.response.data.successLoginRedirect) {
      //   // only will redirect  after some seconds to allow user some time to see success message
      //   setTimeout(() => {
      //     window.location = error.response.data.redirect;
      //   }, 2000);
      //   return Promise.resolve(error);
      // }
      // Here we will intercept every axios request to check if the server is telling us to redirect
      if (error.response && error.response.data && error.response.data.redirect) {
        // if server send redirect. change the browser url location
        // To ignore this and do something before a redirect (recommend using fetch for those cases)
        window.location = error.response.data.redirect;
      }
      if (import.meta.env.DEV && error.message !== "Network Error") {
        const hoveInfo = React.createElement("div", { className: "text-center", style: { fontSize: "20px" } }, "Click inside to close");
        const devInfo = React.createElement(
          "div",
          { className: "py-3", style: { fontSize: "10px" } },
          "This is a Dev Mode Error appearing because the app is in Dev Mode"
        );
        const urlInfo = React.createElement("div", { className: "text-danger py-3" }, error.config.url);
        // const code = React.createElement("code", { className: "" }, `Error: ${error?.message} - ${JSON.stringify(error?.response?.data)}`)
        const jsonV = React.createElement(JsonView, {
          value: { requestMsg: error.message, ...error.response?.data },
          enableClipboard: false,
          indentWidth: 1,
          shortenTextAfterLength: 0,
          displayDataTypes: false
        });
        const codeDiv = React.createElement("div", { className: "bg-white", style: { maxHeight: "300px", overflow: "scroll" } }, jsonV);
        const scroll = React.createElement("div", { style: { fontSize: "10px" } }, "Scroll");
        const reportButton = React.createElement(
          "button",
          {
            style: { marginTop: "20px" },
            onClick: async () => {
              navigator.clipboard.writeText(JSON.stringify({ requestMsg: error.message, ...error.response?.data }));
            }
          },
          "Copy to clipboard"
        );
        const El = React.createElement("div", { className: "flex-column text-white" }, [hoveInfo, devInfo, urlInfo, scroll, codeDiv, reportButton]);

        toast.dark(El, { autoClose: 60000, closeOnClick: false });
        console.error("Axios Error", error);
      }

      return Promise.resolve(error.response);
    }
  );

  // On every Request also sends the the last and current browserURL to API from redirecting purposes
  axios.interceptors.request.use(
    (request: AxiosRequestConfig) => {
      // if there was no previous url to send the user back to
      // if (!document.referrer) return request;

      let currentBrowserPath = window.location.href.replace(window.location.origin, "");
      const lastBrowserPath = document.referrer.substring(window.location.origin.length);
      if (currentBrowserPath === "/login") currentBrowserPath = lastBrowserPath;

      const myheaders = {
        // Doing both for old and new http protocol (old require X-prefix)
        currentbrowserpath: currentBrowserPath,
        "x-currentbrowserpath": currentBrowserPath,
        lastbrowserpath: lastBrowserPath,
        "x-lastbrowserpath": lastBrowserPath
      };

      request.headers = { ...request.headers, ...myheaders };

      return request;
    },
    (error: AxiosError) => {
      return Promise.resolve(error.response);
    }
  );
}
