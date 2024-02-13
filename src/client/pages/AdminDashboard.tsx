import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import AdminUserTable from "../components/AdminUserTable";
import AdminListingsTable from "../components/AdminListingsTable";
import AdminLandlordTable from "../components/AdminLandlordTable";
import { AdminApproveListingTable } from "../components/AdminApproveListingsTable";

export const AdminDashboard = props => {
  return (
    <div>
      <h3 className="fw-bold my-5 ms-5">Admin Dashboard</h3>
      <AdminUserTable />
      <AdminListingsTable />
      <AdminLandlordTable />
      <AdminApproveListingTable />
    </div>
  );
};

export default connect()(AdminDashboard);
