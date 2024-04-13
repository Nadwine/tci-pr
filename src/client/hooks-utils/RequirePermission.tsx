import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { store } from "../redux/store";
import { Navigate } from "react-router-dom";
import { AccountTypeEnum } from "../../../types/enums";

interface ComponentProps {
  view: ReactElement;
  roles: AccountTypeEnum[];
}

const RequirePermission: React.FC<ComponentProps> = ({ view, roles }: { view: ReactElement<any>; roles: AccountTypeEnum[] }) => {
  const authState = store.getState().auth;
  const user = authState.user;
  const userType = authState.user?.accountType;
  const returnPath = window.location.pathname;

  if (!user || !userType) {
    return <Navigate to={`/login?error=Login to complete operation.&returnUrl=${returnPath}`} replace />;
  }

  if (roles.includes(userType)) {
    return view;
  }

  return <h3 className="text-center text-danger mt-5 pt-5">Sorry you do not have required permission to view this page</h3>;
};

export default connect()(RequirePermission);
