import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const enquiryPath = window.location.pathname === "/enquiries";
  const footerClassName = `bg-dark text-white mt-4 ${enquiryPath ? "d-none" : ""}`;
  const navigate = useNavigate();

  return (
    <footer className={footerClassName} style={{ zIndex: 100 }}>
      <div className="container-fluid py-3 px-md-5">
        <div className="row">
          <div className="col-md-3">
            <button className="btn text-white ps-0" onClick={() => navigate(`/about`)}>
              About TCI Homebase
            </button>
          </div>
          <div className="col-md-3">
            <button className="btn text-white ps-0" onClick={() => (window.location.href = `https://www.instagram.com/tcihomebase/?igsh=Z2MwaTVjZzlobHNj`)}>
              Follow us on instagram <i className="bi bi-instagram"></i>
            </button>
          </div>
          <div className="col-md-3">
            <button className="btn text-white ps-0" onClick={() => navigate(`/privacy-terms`)}>
              Terms & Conditions
            </button>
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
