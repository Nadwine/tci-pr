import React, { ReactElement } from "react";
import { connect } from "react-redux";

type Props = {
  style?: React.CSSProperties;
  children: ReactElement<any>;
};

const DesktopOnly: React.FC<Props> = (props: Props) => {
  return (
    <div style={props.style} className="desktop-only d-none d-md-flex d-lg-flex d-xl-flex">
      {props.children}
    </div>
  );
};

export default connect()(DesktopOnly);
