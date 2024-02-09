import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
const UserProfile = props => {
  return (
    <div className="container">
      <div>
        <h3 style={{ margin: "30px", paddingLeft: "45px" }}>Hello User!</h3>
      </div>
      <div className="d-flex flex-row">
        <div className="card shadow-sm" style={{ width: "25%", height: "50%", marginLeft: "70px", padding: "10px", marginRight: "10px", borderRadius: "10px" }}>
          <div className="card" style={{ margin: "2px" }}>
            <div className="card-body border-bottom">Profile Details</div>
          </div>
          <div className="card" style={{ margin: "2px" }}>
            <div className="card-body border-bottom">Account Details</div>
          </div>
        </div>
        <div className="card shadow-sm" style={{ width: "65%", height: "60%", padding: "20px", borderRadius: "10px", marginBottom: "60px" }}>
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
              user.phonenumber
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
