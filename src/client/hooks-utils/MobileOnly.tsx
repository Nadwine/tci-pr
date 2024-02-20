import React, { ReactElement } from "react";
import { connect } from "react-redux";

const MobileOnly: React.FC<any> = ({ children }: { children: ReactElement<any> }) => {
  return <div className="mobile-only d-md-none d-lg-none d-xl-none">{children}</div>;
};

export default connect()(MobileOnly);
