import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

export const SubmitListingMessage = props => {
  return (
    <div className="my-3 text-center" style={{ justifyItems: "center" }}>
      <h3 className="fw-bolder my-4">Thank You!</h3>
      <p>
        One of our agents will review your listing shortly. Go to your <a href="landlord/dashboard">dashboard</a> to track when we approve your listing.
      </p>
      <img src="/static/approve.png"></img>
    </div>
  );
};

export default connect()(SubmitListingMessage);
