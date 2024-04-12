import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const TenantDashboard = props => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="ms-md-5">
        <h3 className="ms-md-5 mt-md-5 fw-bolder w-100 ms-2 mt-5 mb-4">Dashboard</h3>
        <p className="text-muted ms-md-5 mb-3 mb-md-5 text-break ms-2 mb-4" style={{ padding: "7px", borderLeft: "4px solid #e3e7ea" }}>
          Welcome to your dashboard! Everything you need to manage your move, all in one place. As you use our services your <br /> dashboard will serve
          relevant content here.
        </p>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center flex-wrap px-md-5">
        <div
          className="card align-items-center justify-content-center col-md-3 mx-md-2 shadow-lg mb-3 border-0 m-2"
          style={{ padding: "30px", backgroundColor: "white", borderRadius: "15px" }}
        >
          <div className="card-body" style={{ backgroundColor: "white" }}>
            <h4 className="card-title fw-bolder text-center primary-text">Manage Tenancies</h4>
            <p className="text-center text-secondary" style={{ fontSize: "90px" }}>
              <i className="bi bi-file-earmark-text-fill"></i>
            </p>
            <p className="text-center text-muted">Track and manage your active tenancies</p>
            <div className="text-center">
              <button
                className="btn primary-text"
                style={{ border: "2px solid", borderColor: "#077990", borderRadius: "7px" }}
                onClick={() => navigate(`/my-tenancy`)}
              >
                Tenancies
              </button>
            </div>
          </div>
        </div>
        <div
          className="card align-items-center justify-content-center col-md-3 mx-md-2 shadow-lg mb-3 border-0 m-2"
          style={{ padding: "30px", backgroundColor: "white", borderRadius: "15px" }}
        >
          <div className="card-body" style={{ backgroundColor: "white" }}>
            <h4 className="card-title fw-bolder text-center primary-text">Saved Properties</h4>
            <p className="text-center" style={{ fontSize: "90px", color: "pink" }}>
              <i className="bi bi-heart"></i>
            </p>
            <p className="card-text text-center text-muted">View all of your favourite properties saved</p>
            <div className="text-center">
              <button
                className="btn primary-text"
                style={{ border: "2px solid", borderColor: "#077990", borderRadius: "7px" }}
                onClick={() => navigate(`/rent/saved-properties`)}
              >
                View
              </button>
            </div>
          </div>
        </div>
        <div
          className="card align-items-center justify-content-center col-md-3 mx-md-2 shadow-lg mb-3 border-0 m-2"
          style={{ padding: "30px", backgroundColor: "white", borderRadius: "15px" }}
        >
          <div className="card-body" style={{ backgroundColor: "white" }}>
            <h4 className="card-title fw-bolder text-center primary-text">Ready to list a property?</h4>
            <p className="text-center text-info" style={{ fontSize: "90px" }}>
              <i className="bi bi-house-fill"></i>
            </p>
            <p className="card-text text-center text-muted">Find out how to create a listing to find new tenants today</p>
            <div className="text-center">
              <button
                className="btn primary-text"
                style={{ border: "2px solid", borderColor: "#077990", borderRadius: "7px" }}
                onClick={() => navigate(`/about/landlord`)}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(TenantDashboard);
