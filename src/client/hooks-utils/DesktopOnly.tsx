import React, { ReactElement } from "react";
import { connect } from "react-redux";

const DesktopOnly: React.FC<any> = ({ children }: { children: ReactElement<any> }) => {
  return <div className="desktop-only d-none d-md-flex d-lg-flex d-xl-flex">{children}</div>;
};

export default connect()(DesktopOnly);
