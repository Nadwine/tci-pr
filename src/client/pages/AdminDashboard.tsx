import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import AdminUserTable from "../components/AdminUserTable";
import AdminListingsTable from "../components/AdminListingsTable";
import AdminLandlordTable from "../components/AdminLandlordTable";
import { AdminApproveListingTable } from "../components/AdminApproveListingsTable";
import AdminChart from "../components/AdminChart";

export const AdminDashboard = props => {
  return (
    <div>
      <h3 className="fw-bold m-5">Admin Dashboard</h3>
      <AdminChart />
    </div>
  );
};

export default connect()(AdminDashboard);
