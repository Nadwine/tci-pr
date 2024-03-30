import React from "react";
import { connect } from "react-redux";

const Footer = () => {
  const enquiryPath = window.location.pathname === "/enquiries";
  const footerClassName = `bg-dark text-white mt-4 ${enquiryPath ? "d-none" : ""}`;
  return (
    <footer className={footerClassName} style={{ zIndex: 100 }}>
      <div className="container-fluid py-3 px-md-5">
        <div className="row">
          <div className="col-md-3">
            <a className="text-white text-decoration-none" href="/about">
              About TCI Homebase
            </a>
          </div>
          <div className="col-md-3">
            <a className="text-white text-decoration-none" href="#">
              Follow us on instagram <i className="bi bi-instagram"></i>
            </a>
          </div>
          <div className="col-md-3">
            <a className="text-white text-decoration-none" href="/privacy-terms">
              Terms & Conditions
            </a>
          </div>
          <div className="col-md-3">
            {/* <div className="col-md-3"></div> */}
            <div className="small">©2024 TCI Homebase.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default connect()(Footer);
