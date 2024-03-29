import React from "react";
import { connect } from "react-redux";

export const GonePropertyOverlay = props => {
  return (
    <div
      className="gone-cover d-flex justify-content-center align-items-center"
      style={{ width: "100%", height: "100%", position: "absolute", backgroundColor: "#ffffffb3" }}
    >
      <h3 className="text-danger">Property Gone</h3>
    </div>
  );
};

export default connect()(GonePropertyOverlay);
