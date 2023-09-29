import React from "react";
import Main from "./Main";
import { ContextWrapper } from "./Context";

export const Root = () => {
  return (
    <ContextWrapper>
      <Main />
    </ContextWrapper>
  );
};

export default Root;
