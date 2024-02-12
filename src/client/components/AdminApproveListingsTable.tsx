import React from "react";
import { connect } from "react-redux";

export const AdminApproveListingsTable = props => {
  return (
    <div>
      AdminApproveListingsTable
      <table className="table table-striped table-hover"></table>
    </div>
  );
};

export default connect()(AdminApproveListingsTable);
