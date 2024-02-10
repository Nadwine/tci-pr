import React, { useState } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapse] = useState(true);
  const [userDropDownShow, setUserDropDownShow] = useState(false);
  const user: any = useSelector((reduxState: RootState) => reduxState.auth.user);
  const isLoggedIn = Boolean(user?.id);
  const numberOfNewMessages = useSelector((root: RootState) => root.message.numberOfNewMessages);

  const logout = async () => {
    await axios.get("/logout");
  };

  console.log("loggedIn", isLoggedIn);

  const dynamicClassName = isCollapsed ? "collapse navbar-collapse" : "navbar-collapse";
  const shouldShowUserDropDown = isCollapsed === false ? "show" : userDropDownShow ? "show" : "";
  return (
    <nav className="navbar navbar-expand-md navbar-light fixed-top bg-light px-0 shadow-sm">
      <div className="container-xl">
        {/* <!-- Logo --> */}
        <a className="navbar-brand d-flex flex-row" href="/">
          <img src="/static/web-logo-cyan.png" style={{ width: "40px" }} className="h-8" alt="..." />
          <span className="d-flex align-items-center ps-2" style={{ fontSize: "0.7em", fontWeight: "bold" }}>
            TCI Homebase
          </span>
        </a>
        {/* <!-- Navbar toggle --> */}
        <button
          className="navbar-toggler"
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
        {isLoggedIn && (
          <div className="d-flex" style={{ position: "fixed", display: "flex !important", top: "10px", right: "7%" }}>
            {/* <div className="nav-item nav-link  ms-2 text-muted">
            <span className="bi bi-bell-fill fs-5 position-relative">
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                12
              </span>
            </span>
          </div> */}
            <div className="nav-item nav-link pe-5 text-muted">
              <span onClick={() => navigate("enquiries")} className="bi bi-chat-dots-fill fs-5 position-relative point">
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem", float: "right" }}
                >
                  {numberOfNewMessages > 0 && numberOfNewMessages}
                </span>
              </span>
            </div>
          </div>
        )}
        {/* notification icons End */}

        {/* <!-- Collapse --> */}
        <div className={dynamicClassName} id="navbarCollapse">
          {/* <!-- Nav --> */}
          <div className="navbar-nav mx-lg-auto">
            <a className="nav-item nav-link" href="/products" aria-current="page">
              Products & Services
            </a>
            <a className="nav-item nav-link" href="/feedback">
              Report
            </a>
            <a className="nav-item nav-link" href="/help">
              Help
            </a>
          </div>
          {/* <!-- Right navigation --> */}
          {user && (
            <ul className="nav navbar-nav ms-auto pe-2">
              <li className="nav-item dropdown">
                <span
                  className="btn btn-link nav-link rounded-circle text-black fs-5"
                  style={{ width: "45px", height: "45px", backgroundColor: "darkgrey" }}
                  onClick={() => {
                    setUserDropDownShow(!userDropDownShow);
                    setIsCollapse(true);
                  }}
                  onBlur={() => setUserDropDownShow(false)}
                >
                  {user?.email.charAt(0).toUpperCase()}
                </span>
                <div className={`dropdown-menu dropdown-menu-light mt-3 ${shouldShowUserDropDown}`} style={{ left: "auto", right: 0 }}>
                  <a href="/user" className="dropdown-item">
                    My Profile
                  </a>
                  {user.accountType === "admin" && (
                    <a href="/dashboard" className="dropdown-item">
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
                      Listings
                    </a>
                  )}
                  <a href="#" className="dropdown-item">
                    Settings
                  </a>
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
              <a className="nav-item nav-link" href="/login">
                Sign in
              </a>
            </div>
          )}
          {/* <!-- Action --> */}
          {!user && (
            <div className="d-flex align-items-lg-center mt-lg-0">
              <a href="/register" className="btn btn-sm w-full w-lg-auto bg-primary text-white">
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
