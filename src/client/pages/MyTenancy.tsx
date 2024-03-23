import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

export const MyTenancy = props => {
  return (
    <div>
      <h5>My Tenancy</h5>
      <div>
        <div className="mx-5">
          <h5>Property</h5>
          <table className="table table table-borderless">
            <thead>
              <tr className="table-light">
                <th scope="col">Address Line 1</th>
                <th scope="col">Island</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dummy Address</td>
                <td>Dummy Island</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mx-5">
          <h5>Tenants</h5>
          <table className="table table table-borderless">
            <thead>
              <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mark</td>
                <td>Otto</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mx-5">
          <h5>Landlord</h5>
          <table className="table table table-borderless">
            <thead>
              <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mark</td>
                <td>Otto</td>
              </tr>
            </tbody>
          </table>
          <hr />
        </div>
        <div className="mx-5">
          <h5>Tenancy</h5>
          <table className="table table table-borderless">
            <thead>
              <tr>
                <th scope="col">Start Date</th>
                <th scope="col">Lead Tenant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jan 20 2022</td>
                <td>Otto</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mx-5">
          <h5>Deposit Information</h5>
          <table className="table table table-borderless">
            <thead>
              <tr>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$1000</td>
                <td>Released</td>
              </tr>
            </tbody>
          </table>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default connect()(MyTenancy);
