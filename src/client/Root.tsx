import React from "react";
import Main from "./Main";
import { ContextWrapper } from "./Context";

window.addEventListener("activate", function (event: any) {
  event?.waitUntil(
    caches.keys().then(function (names) {
      for (let name of names) caches.delete(name);
    })
  );
});

export const Root = () => {
  return (
    <ContextWrapper>
      <Main />
    </ContextWrapper>
  );
};

export default Root;
