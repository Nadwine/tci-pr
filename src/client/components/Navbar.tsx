import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapse] = useState(true);
  const [userDropDownShow, setUserDropDownShow] = useState(false);
  const user = useSelector((reduxState: RootState) => reduxState.auth.user);
  const isLoggedIn = Boolean(user?.id);
  const numberOfNewMessages = useSelector((root: RootState) => root.message.numberOfNewMessages);
  const [isHome, setIsHome] = useState(false);

  const contactClick = () => {
    if (window.location.pathname === "/about") {
      document.getElementById("contact-btn")?.focus();
      setIsCollapse(true);
    } else {
      navigate("/about?focus-contact=true");
      setIsCollapse(true);
    }
  };
  useEffect(() => {
    if (location.pathname === "/") {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [location.key]);

  const dynamicClassName = isCollapsed ? "collapse navbar-collapse" : "navbar-collapse";
  const shouldShowUserDropDown = isCollapsed === false ? "show" : userDropDownShow ? "show" : "";
  return (
    <nav className={`${isHome && "nav-home"} navbar navbar-expand-md navbar-light fixed-top bg-light px-0 shadow-sm`}>
      <div className="container-xl">
        {/* <!-- Logo --> */}
        <a className="navbar-brand d-flex flex-row" href="/">
          <img src="/static/web-logo-cyan.png" style={{ width: "40px" }} className="h-8" alt="..." />
          <span className="d-flex align-items-center fs-6 ps-2">TCI Homebase</span>
        </a>
        {/* <!-- Navbar toggle --> */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsCollapse(!isCollapsed)}
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* notification icons Start */}
        {isLoggedIn && <div className="d-flex" style={{ position: "fixed", display: "flex !important", top: "10px", right: "10%" }}></div>}
        {/* notification icons End */}

        {/* <!-- Collapse --> */}
        <div className={dynamicClassName} id="navbarCollapse">
          {/* <!-- Nav --> */}
          <div className="navbar-nav mx-lg-auto">
            <a className="nav-item nav-link" href="/products" aria-current="page" style={{ color: "#032830" }}>
              Products & Services
            </a>
            <a className="nav-item nav-link" href="/about/us/landlord" aria-current="page" style={{ color: "#032830" }}>
              Landlord
            </a>
            <a className="nav-item nav-link  text-dark" href="/about" style={{ color: "#032830" }}>
              About Us
            </a>
            <a className="nav-item nav-link  text-dark" href="/help" style={{ color: "#032830" }}>
              Help
            </a>
            <a className="nav-item nav-link text-dark" href="/feedback" style={{ color: "#032830" }}>
              Feedback
            </a>
            <a className="nav-item nav-link text-dark point" onClick={() => contactClick()} style={{ color: "#032830" }}>
              Contact
            </a>
            <a className="nav-item nav-link text-dark point" href="/team" style={{ color: "#032830" }}>
              Our Team
            </a>
          </div>
          {/* <!-- Right navigation --> */}
          {user && (
            <ul className="nav navbar-nav ms-auto pe-2">
              <li className="nav-item dropdown">
                {!user.Profile && (
                  <span
                    className="btn btn-link nav-link rounded-circle fw-bold text-light fs-5"
                    style={{ width: "45px", height: "45px", backgroundColor: "#087990" }}
                    onClick={() => {
                      setUserDropDownShow(!userDropDownShow);
                      setIsCollapse(true);
                    }}
                    onBlur={() => setUserDropDownShow(false)}
                  >
                    {!user.Profile && user?.email.charAt(0).toUpperCase()}
                  </span>
                )}
                {user.Profile && (
                  <Avatar
                    className="point"
                    src={user.Profile.ProfileMedia[0].mediaUrl}
                    style={{ width: "45px", height: "45px" }}
                    onClick={() => {
                      setUserDropDownShow(!userDropDownShow);
                      setIsCollapse(true);
                    }}
                    onBlur={() => setUserDropDownShow(false)}
                  />
                )}
                <div className={`dropdown-menu dropdown-menu-light mt-3 ${shouldShowUserDropDown}`} style={{ left: "auto", right: 0 }}>
                  {user.accountType === "tenant" && (
                    <a href="/user/dashboard" className="dropdown-item">
                      Dashboard
                    </a>
                  )}
                  <a href="/user" className="dropdown-item">
                    Profile & Settings
                  </a>
                  {user.accountType === "landlord" && (
                    <a href="/landlord/create-listing" className="dropdown-item">
                      Create a Listing
                    </a>
                  )}
                  <a href="/enquiries" className="dropdown-item">
                    Enquiries
                  </a>
                  {user.accountType === "tenant" && (
                    <a href="/my-tenancy" className="dropdown-item">
                      My Tenancy
                    </a>
                  )}
                  {user.accountType === "landlord" && (
                    <a href="/landlord/dashboard" className="dropdown-item">
                      Dashboard
                    </a>
                  )}
                  {user.accountType === "admin" && (
                    <a href="/create-listing" className="dropdown-item">
                      Create Listing
                    </a>
                  )}
                  {user.accountType === "admin" && (
                    <a href="/admin/listings" className="dropdown-item">
                      View Listings
                    </a>
                  )}
                  <div className="dropdown-divider"></div>
                  <a href="/logout" className="dropdown-item">
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          )}
          {!user && (
            <div className="navbar-nav ms-auto">
              <a className="nav-item nav-link fw-bold" href="/login" style={{ color: "#032830" }}>
                Sign in
              </a>
            </div>
          )}
          {/* <!-- Action --> */}
          {!user && (
            <div className="d-flex align-items-lg-center mt-lg-0">
              <a href="/register" className="btn btn-md w-full w-lg-auto text-light fw-bold" style={{ borderRadius: "10px", backgroundColor: "#087990" }}>
                Register
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default connect()(Navbar);
