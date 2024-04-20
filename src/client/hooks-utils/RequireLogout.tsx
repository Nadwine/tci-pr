// @ts-ignore
import React, { ReactElement, useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface ComponentProps {
  view: ReactElement;
}

const RequireLogout: React.FC<ComponentProps> = ({ view }: { view: ReactElement<any> }) => {
  const user = useSelector((rootState: RootState) => rootState.auth.user);
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  if (user) {
    if (error) toast.error(error);
    return <Navigate to="/" replace />;
  }

  return view;
};

export default connect()(RequireLogout);
