// @ts-ignore
import React, { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

interface ComponentProps {
  view: ReactElement;
}

const RequireLogout: React.FC<ComponentProps> = ({ view }: { view: ReactElement<any> }) => {
  const user = useSelector((rootState: RootState) => rootState.auth.user);

  if (user) {
    return <Navigate to="/my-profile" replace />;
  }

  return view;
};

export default connect()(RequireLogout);
