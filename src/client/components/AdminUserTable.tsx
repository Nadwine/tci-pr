import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import fakeData from "../../database/fake-data/users";

export const AdminUserTable = props => {
  return (
    <div>
      AdminUserTable
      <table className="table table-striped table-hover"></table>
    </div>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserTable);
