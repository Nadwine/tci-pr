import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
const UserProfile = props => {
  return (
    <div className="container">
      <div>
        <h3>Hello {},</h3>
      </div>
      <div className="card" style={{ width: "25%", height: "50%", marginLeft: "70px" }}>
        <div className="card">
          <div className="card-body">Profile Details</div>
        </div>
        <div className="card">
          <div className="card-body">Account Details</div>
        </div>
      </div>
      <div className="card" style={{ width: "65%", height: "50%" }}>
        <div className="card">
          <div className="card-body">Name</div>
        </div>
        <div className="card">
          <div className="card-body">Email</div>
        </div>
        <div className="card">
          <div className="card-body">Address</div>
        </div>
        <div className="card">
          <div className="card-body">Telephone Number</div>
        </div>
      </div>
    </div>
  );
};

export default connect()(UserProfile);
