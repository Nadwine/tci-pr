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
      document.getElementById("contact-btn-mobile")?.focus();
      document.getElementById("contact-btn-desktop")?.focus();
      setIsCollapse(true);
    } else {
      navigate("/about?focus-contact=true");
      setIsCollapse(true);
      setUserDropDownShow(false);
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

  //@ts-ignore
  const hasProfilePic = user?.Profile?.ProfileMedia?.length > 0;
  return (
    <nav className={`${isHome && "nav-home"} navbar navbar-expand-md navbar-light fixed-top bg-light px-0 shadow-sm`}>
      <div className="container-xl">
        {/* <!-- Logo --> */}
        <span
          className="point navbar-brand d-flex flex-row align-items-center"
          onClick={() => {
            navigate("/");
            setIsCollapse(true);
            setUserDropDownShow(false);
          }}
        >
          <img src="/static/web-logo-cyan.png" style={{ width: "40px" }} className="h-8" alt="..." />
          <span className="d-flex align-items-center fs-6 ps-2">TCI Homebase</span>
        </span>
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
            <span
              className="point nav-item nav-link"
              onClick={() => {
                navigate("/products");
                setIsCollapse(true);
                setUserDropDownShow(false);
              }}
              aria-current="page"
              style={{ color: "#032830" }}
            >
              Products & Services
            </span>
            <span
              className="point nav-item nav-link"
              onClick={() => {
                navigate("/about/us/landlord");
                setIsCollapse(true);
                setUserDropDownShow(false);
              }}
              aria-current="page"
              style={{ color: "#032830" }}
            >
              Landlord
            </span>
            <span
              className="point nav-item nav-link  text-dark"
              onClick={() => {
                navigate("/about");
                setIsCollapse(true);
                setUserDropDownShow(false);
              }}
              style={{ color: "#032830" }}
            >
              About Us
            </span>
            <span
              className="point nav-item nav-link  text-dark"
              onClick={() => {
                navigate("/help");
                setIsCollapse(true);
                setUserDropDownShow(false);
              }}
              style={{ color: "#032830" }}
            >
              Help
            </span>
            <span
              className="point nav-item nav-link text-dark"
              onClick={() => {
                navigate("/feedback");
                setIsCollapse(true);
                setUserDropDownShow(false);
              }}
              style={{ color: "#032830" }}
            >
              Feedback
            </span>
            <span
              className="point nav-item nav-link text-dark"
              onClick={() => {
                contactClick();
                setIsCollapse(true);
                setUserDropDownShow(false);
              }}
              style={{ color: "#032830" }}
            >
              Contact
            </span>
            <span
              className="nav-item nav-link text-dark point"
              onClick={() => {
                navigate("/team");
                setIsCollapse(true);
                setUserDropDownShow(false);
              }}
              style={{ color: "#032830" }}
            >
              Our Team
            </span>
          </div>
          {/* <!-- Right navigation --> */}
          {user && (
            <ul className="nav navbar-nav ms-auto pe-2">
              <li className="nav-item dropdown">
                {!hasProfilePic && (
                  <span
                    className="btn btn-link nav-link rounded-circle fw-bold text-light fs-5"
                    style={{ width: "45px", height: "45px", backgroundColor: "#087990" }}
                    onClick={() => {
                      setUserDropDownShow(!userDropDownShow);
                      setIsCollapse(true);
                    }}
                    onBlur={() => setUserDropDownShow(false)}
                  >
                    {user?.email.charAt(0).toUpperCase()}
                  </span>
                )}
                {hasProfilePic && (
                  <Avatar
                    className="point"
                    src={user?.Profile?.ProfileMedia[0].mediaUrl}
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
                    <span
                      onClick={() => {
                        navigate("/user/dashboard");
                        setIsCollapse(true);
                        setUserDropDownShow(false);
                      }}
                      className="point dropdown-item"
                    >
                      Dashboard
                    </span>
                  )}
                  {user.accountType === "tenant" && (
                    <span
                      onClick={() => {
                        navigate("/rent/saved-properties");
                        setIsCollapse(true);
                        setUserDropDownShow(false);
                      }}
                      className="point dropdown-item"
                    >
                      Saved Properties
                    </span>
                  )}
                  <span
                    onClick={() => {
                      navigate("/user");
                      setIsCollapse(true);
                      setUserDropDownShow(false);
                    }}
                    className="point dropdown-item"
                  >
                    Profile & Settings
                  </span>
                  {user.accountType === "landlord" && (
                    <span
                      onClick={() => {
                        navigate("/landlord/create-listing");
                        setIsCollapse(true);
                        setUserDropDownShow(false);
                      }}
                      className="point dropdown-item"
                    >
                      Create a Listing
                    </span>
                  )}
                  <span
                    onClick={() => {
                      navigate("/enquiries");
                      setIsCollapse(true);
                      setUserDropDownShow(false);
                    }}
                    className="point dropdown-item"
                  >
                    Enquiries
                  </span>
                  {user.accountType === "tenant" && (
                    <span
                      onClick={() => {
                        navigate("/my-tenancy");
                        setIsCollapse(true);
                        setUserDropDownShow(false);
                      }}
                      className="point dropdown-item"
                    >
                      My Tenancy
                    </span>
                  )}
                  {user.accountType === "landlord" && (
                    <span
                      onClick={() => {
                        navigate("/landlord/dashboard");
                        setIsCollapse(true);
                        setUserDropDownShow(false);
                      }}
                      className="point dropdown-item"
                    >
                      Dashboard
                    </span>
                  )}
                  {user.accountType === "admin" && (
                    <span
                      onClick={() => {
                        navigate("/create-listing");
                        setIsCollapse(true);
                        setUserDropDownShow(false);
                      }}
                      className="point dropdown-item"
                    >
                      Create Listing
                    </span>
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
              <span
                className="point nav-item nav-link fw-bold"
                onClick={() => {
                  navigate("/login");
                  setIsCollapse(true);
                  setUserDropDownShow(false);
                }}
                style={{ color: "#032830" }}
              >
                Sign in
              </span>
            </div>
          )}
          {/* <!-- Action --> */}
          {!user && (
            <div className="d-flex align-items-lg-center mt-lg-0">
              <span
                onClick={() => {
                  navigate("/register");
                  setIsCollapse(true);
                  setUserDropDownShow(false);
                }}
                className="btn btn-md w-full w-lg-auto text-light fw-bold"
                style={{ borderRadius: "10px", backgroundColor: "#087990" }}
              >
                Register
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default connect()(Navbar);
