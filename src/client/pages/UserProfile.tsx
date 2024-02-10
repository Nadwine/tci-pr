import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { RootState } from "../redux/store";
const UserProfile = props => {
  return (
    <div className="container px-5 pt-5">
      <div>
        <h3 className="pb-3">User Profile</h3>
      </div>

      <div className="col-12 d-flex flex-wrap w-100">
        <div className="col-12 col-md-3 col-lg-3 card shadow-sm p-2" style={{ borderRadius: "10px", height: "fit-content" }}>
          <div className="card">
            <div className="card-body border-bottom">Profile Details</div>
          </div>
          <div className="card">
            <div className="card-body border-bottom">Account Details</div>
          </div>
        </div>
        <div className="col-12 col-md-9 col-lg-9 card shadow-sm" style={{ padding: "20px", borderRadius: "10px" }}>
          <div className="card" style={{ margin: "15px" }}>
            <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
              <h5 className="card-title">Name</h5>
              user.name
              <button className="btn btn-white" style={{ float: "right" }}>
                edit <i className="bi bi-pencil-square" />
              </button>
            </div>
          </div>
          <div className="card" style={{ margin: "15px" }}>
            <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
              <h5 className="card-title">Email</h5>
              user.email
              <button className="btn btn-white" style={{ float: "right" }}>
                edit <i className="bi bi-pencil-square" />
              </button>
            </div>
          </div>
          <div className="card" style={{ margin: "15px" }}>
            <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
              <h5 className="card-title">Address</h5>
              user.address
              <button className="btn btn-white" style={{ float: "right" }}>
                edit <i className="bi bi-pencil-square" />
              </button>
            </div>
          </div>
          <div className="card" style={{ margin: "15px" }}>
            <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
              <h5 className="card-title">Telephone</h5>
              user.phoneNumber
              <button className="btn btn-white" style={{ float: "right" }}>
                edit <i className="bi bi-pencil-square" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(UserProfile);
