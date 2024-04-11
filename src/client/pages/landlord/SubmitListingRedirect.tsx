import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

export const SubmitListingMessage = props => {
  const navigate = useNavigate();

  return (
    <div className="my-3 text-center" style={{ justifyItems: "center" }}>
      <h3 className="fw-bolder my-4">Thank You!</h3>
      <p>
        One of our agents will review your listing shortly. Go to your
        <button className="btn text-primary ps-0" onClick={() => navigate(`/landlord/dashboard`)}>
          dashboard
        </button>
        to track when we approve your listing.
      </p>
      <img src="/static/approve.png"></img>
    </div>
  );
};

export default connect()(SubmitListingMessage);
