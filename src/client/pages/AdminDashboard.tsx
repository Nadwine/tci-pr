import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import AdminUserTable from "../components/AdminUserTable";

export const AdminDashboard = props => {
  return (
    <div>
      <h3 className="fw-bold my-5 ms-5">Admin Dashboard</h3>
      <AdminUserTable />
    </div>
  );
};

export default connect()(AdminDashboard);
