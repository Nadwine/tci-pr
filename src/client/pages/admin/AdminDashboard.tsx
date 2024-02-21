import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import AdminUserTable from "../../components/admin/AdminUserTable";
import AdminListingsTable from "../../components/admin/AdminListingsTable";
import AdminLandlordTable from "../../components/admin/AdminLandlordTable";
import { AdminApproveListingTable } from "../../components/admin/AdminApproveListingsTable";
import AdminChart from "../../components/admin/AdminChart";

export const AdminDashboard = props => {
  return (
    <div>
      <h3 className="fw-bold m-5">Admin Dashboard</h3>
      <AdminChart />
    </div>
  );
};

export default connect()(AdminDashboard);
