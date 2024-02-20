import React, { ReactElement } from "react";
import { connect } from "react-redux";

type Props = {
  style?: React.CSSProperties;
  children: ReactElement<any>;
};

const MobileOnly: React.FC<Props> = (props: Props) => {
  return (
    <div style={props.style} className="mobile-only d-md-none d-lg-none d-xl-none">
      {props.children}
    </div>
  );
};

export default connect()(MobileOnly);
