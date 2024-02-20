import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const LandlordProposalButton = props => {
  const navigate = useNavigate();

  return (
    <div
      className="text-white text-center p-2 point"
      onClick={() => navigate("/about/landlord")}
      style={{ zIndex: 500, position: "fixed", bottom: 0, right: 0, width: "200px", backgroundColor: "#013672", borderTopLeftRadius: "20px" }}
    >
      Got a Property? <br /> <span className="fs-6">click here for more info</span>
    </div>
  );
};

export default connect()(LandlordProposalButton);
