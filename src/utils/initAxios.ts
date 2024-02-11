// @ts-nocheck
import axios, { AxiosRequestConfig, AxiosRequestTransformer, AxiosResponse } from "axios";

// https://lifesaver.codes/answer/need-some-advice-about-handling-302-redirects-from-ajax
export default function initAxios() {
  axios.defaults.withCredentials = true;

  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.data.redirect) {
        window.location = response.data.redirect;
        return;
      }
      return response;
    },
    error => {
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

      return error;
    }
  );

  // On every Request also sends the the last and current browserURL to API from redirecting purposes
  axios.interceptors.request.use(
    (request: AxiosRequestConfig) => {
      // if there was no previous url to send the user back to
      // if (!document.referrer) return request;

      let currentBrowserPath = window.location.pathname;
      const lastBrowserPath = document.referrer.substring(window.location.origin.length);
      if (currentBrowserPath === "/login") currentBrowserPath = lastBrowserPath;

      const myheaders = {
        // Doing both for old and new http protocol (old require X-prefix)
        "currentbrowserpath": currentBrowserPath,
        "x-currentbrowserpath": currentBrowserPath,
        "lastbrowserpath": lastBrowserPath,
        "x-lastbrowserpath": lastBrowserPath
      };

      request.headers = { ...request.headers, ...myheaders };

      return request;
    },
    error => {
      return Promise.reject(error);
    }
  );
}
