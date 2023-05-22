import React from "react";
import { connect } from "react-redux";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-4" style={{ zIndex: 100 }}>
      <div className="container-fluid py-3">
        <div className="row">
          <div className="col-md-3">
            <h5>Footer</h5>
          </div>
          <div className="col-md-3"></div>
          <div className="col-md-3"></div>
          <div className="col-md-3"></div>
        </div>
        <div className="row">
          <div className="col-md-6">
            I stay at the bottom of the viewport!{" "}
            <span className="small">
              <br />
              Unless the page content pushes me further.
            </span>
          </div>
          <div className="col-md-3"></div>
          <div className="col-md-3 text-right small align-self-end">©2017 Brand, Inc.</div>
        </div>
      </div>
    </footer>
  );
};

export default connect()(Footer);
