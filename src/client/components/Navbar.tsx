import React, { useState } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";

function Navbar() {
  const [isCollapsed, setIsCollapse] = useState(true);
  const [userDropDownShow, setUserDropDownShow] = useState(false);
  const user: any = useSelector((reduxState: RootState) => reduxState.auth.user);

  const logout = async () => {
    await axios.get("/logout");
  };

  const dynamicClassName = isCollapsed ? "collapse navbar-collapse" : "navbar-collapse";
  const shouldShowUserDropDown = isCollapsed === false ? "show" : userDropDownShow ? "show" : "";
  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark px-0">
      <div className="container-xl">
        {/* <!-- Logo --> */}
        <a className="navbar-brand" href="/">
          <img src="/static/android-chrome-512x512.png" style={{ width: "40px" }} className="h-8" alt="..." />
          <span className="text-white ps-2" style={{ fontSize: "1em" }}>
            Makit
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
        {/* <!-- Collapse --> */}
        <div className={dynamicClassName} id="navbarCollapse">
          {/* <!-- Nav --> */}
          <div className="navbar-nav mx-lg-auto">
            <a className="nav-item nav-link active" href="#" aria-current="page">
              Home
            </a>
            <a className="nav-item nav-link" href="#">
              Product
            </a>
            <a className="nav-item nav-link" href="#">
              Features
            </a>
            <a className="nav-item nav-link" href="#">
              Pricing
            </a>
          </div>
          {/* <!-- Right navigation --> */}
          {user && (
            <ul className="nav navbar-nav ms-auto pe-2">
              <div className="nav-item nav-link">
                <span className="bi bi-chat-dots-fill fs-5 position-relative">
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                    3
                  </span>
                </span>
              </div>
              <div className="nav-item nav-link mx-3">
                <span className="bi bi-bell-fill fs-5 position-relative">
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                    12
                  </span>
                </span>
              </div>
              <li className="nav-item dropdown">
                <span
                  className="btn btn-link nav-link bg-light rounded-circle text-black fs-5"
                  style={{ width: "45px", height: "45px" }}
                  onClick={() => {
                    setUserDropDownShow(!userDropDownShow);
                    setIsCollapse(true);
                  }}
                  onBlur={() => setUserDropDownShow(false)}
                >
                  {user?.username.charAt(0).toUpperCase()}
                </span>
                <div className={`dropdown-menu dropdown-menu-dark ${shouldShowUserDropDown}`} style={{ left: "auto", right: 0 }}>
                  <a href="/my-profile" className="dropdown-item">
                    My Profile
                  </a>
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
              <a href="/register" className="btn btn-sm w-full w-lg-auto palette-yellow">
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
