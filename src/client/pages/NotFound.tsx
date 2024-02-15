import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

const NotFound = props => {
  return (
    <div className="text-center">
      <h1 className="text-center pt-5">Theres nothing here: 404!</h1> <p>The page you are looking for does not exist or has been removed</p>
      <img src="/static/error.png"></img>
    </div>
  );
};

export default connect()(NotFound);
