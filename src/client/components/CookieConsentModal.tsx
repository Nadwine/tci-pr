import React, { useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";

// TODO customize cookie category https://codepen.io/iubenda/pen/zYYJwYr?editors=1000
const CookieConsentModal = props => {
  const [show, setShow] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAcceptAll = event => {
    sessionStorage.setItem("makit_cookie_consent", "true");
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Cookie consent</Modal.Title>
      </Modal.Header>
      <Modal.Body>By using this website you agree to the processing of cookie to enable the basic functions of the site.</Modal.Body>
      <Modal.Footer>
        <Button variant="white">Customize</Button>
        <Button onClick={handleAcceptAll} variant="primary">
          Accept all
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default connect()(CookieConsentModal);
