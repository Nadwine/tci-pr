import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";

export const AcceptInvitation = props => {
  const [searchParams, setSearchParams] = useSearchParams();
  const result = searchParams.get("result") || "";
  const message = searchParams.get("message") || "";

  return (
    <div className="px-md-5">
      {result === "failed" && <h5 className="pt-5 text-danger text-center mt-5">{message}</h5>}
      {result === "success" && <h5 className="pt-5 text-success text-center mt-5">{message}</h5>}
    </div>
  );
};

export default connect()(AcceptInvitation);
