import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapse] = useState(true);
  const [userDropDownShow, setUserDropDownShow] = useState(false);
  const user: any = useSelector((reduxState: RootState) => reduxState.auth.user);
  const isLoggedIn = Boolean(user?.id);
  const numberOfNewMessages = useSelector((root: RootState) => root.message.numberOfNewMessages);
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [location.key]);

  const logout = async () => {
    await axios.get("/logout");
  };

  console.log("loggedIn", isLoggedIn);
  console.log(location.pathname);

  const dynamicClassName = isCollapsed ? "collapse navbar-collapse" : "navbar-collapse";
  const shouldShowUserDropDown = isCollapsed === false ? "show" : userDropDownShow ? "show" : "";
  return (
    <nav className={`${isHome && "nav-home"} navbar navbar-expand-md navbar-light fixed-top bg-light px-0 shadow-sm`}>
      <div className="container-xl">
        {/* <!-- Logo --> */}
        <a className="navbar-brand d-flex flex-row" href="/">
          <img src="/static/web-logo-cyan.png" style={{ width: "40px" }} className="h-8" alt="..." />
          <span className="d-flex align-items-center fw-bolder fs-6 ps-2">TCI Homebase</span>
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
          <div className="d-flex" style={{ position: "fixed", display: "flex !important", top: "10px", right: "10%" }}>
            {/* <div className="nav-item nav-link  ms-2 text-muted">
            <span className="bi bi-bell-fill fs-5 position-relative">
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                12
              </span>
            </span>
          </div> */}
            {/* <div className="pe-5 nav-item nav-link text-cyan">
              <span
                onClick={() => navigate("enquiries")}
                className="bi bi-chat-dots-fill fs-5 bs-info fw-bold position-relative point"
                style={{ backgroundColor: "0dcaf0" }}
              >
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem", float: "right" }}
                >
                  {numberOfNewMessages > 0 && numberOfNewMessages}
                </span>
              </span>
            </div> */}
          </div>
        )}
        {/* notification icons End */}

        {/* <!-- Collapse --> */}
        <div className={dynamicClassName} id="navbarCollapse">
          {/* <!-- Nav --> */}
          <div className="navbar-nav mx-lg-auto">
            <a className="nav-item nav-link fw-bold" href="/products" aria-current="page" style={{ color: "#032830" }}>
              Products & Services
            </a>
            <a className="nav-item nav-link fw-bold text-dark" href="/about" style={{ color: "#032830" }}>
              About Us
            </a>
            <a className="nav-item nav-link fw-bold text-dark" href="/help" style={{ color: "#032830" }}>
              Help
            </a>
            <a className="nav-item nav-link fw-bold text-dark" href="/feedback" style={{ color: "#032830" }}>
              Report Feedback
            </a>
          </div>
          {/* <!-- Right navigation --> */}
          {user && (
            <ul className="nav navbar-nav ms-auto pe-2">
              <li className="nav-item dropdown">
                <span
                  className="btn btn-link nav-link rounded-circle fw-bold text-dark fs-5"
                  style={{ width: "45px", height: "45px", backgroundColor: "#0dcaf0" }}
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
                    Profile & Settings
                  </a>
                  <a href="/enquiries" className="dropdown-item">
                    Enquiries
                  </a>
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
              <a href="/register" className="btn btn-md w-full w-lg-auto bg-info fw-bold" style={{ borderRadius: "10px" }}>
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
