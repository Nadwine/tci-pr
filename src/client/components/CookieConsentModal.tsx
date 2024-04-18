import React, { useCallback, useState } from "react";
import { Button, Modal, Offcanvas } from "react-bootstrap";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

// TODO customize cookie category https://codepen.io/iubenda/pen/zYYJwYr?editors=1000
const CookieConsentModal = props => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAcceptAll = event => {
    localStorage.setItem("makit_cookie_consent", "true");
    setShow(false);
  };

  return (
    <div className="px-md-5">
      <Offcanvas show={show} scroll onHide={handleClose} placement="bottom" {...props}>
        <Offcanvas.Header style={{ height: "1em", padding: "20px 0px 0px 20px" }}>
          <Offcanvas.Title>Cookie Consent</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ fontSize: "13px" }}>
          <div className="py-md-3">
            By using this website you agree to the processing of{" "}
            <button onClick={() => navigate("/cookie-terms")} style={{ fontSize: "13px" }} className="btn btn-link link-dark m-0 p-0">
              cookies
            </button>{" "}
            to enable the basic functions of the site.
          </div>
          <div className="w-100 text-center">
            <button className="float-start mt-2 btn btn-sm btn-dark" onClick={handleAcceptAll}>
              Accept All
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default connect()(CookieConsentModal);
