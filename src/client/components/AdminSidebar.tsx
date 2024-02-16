import PropTypes from "prop-types";
import React, { useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";

const AdminSidebar = props => {
  const [isOpen, setIsOpen] = useState(false);

  // closed width 50px
  return (
    <div
      className="d-flex position-fixed flex-column text-white"
      style={{ zIndex: 999, top: 0, left: 0, height: "100vh", width: isOpen ? 200 : 50, paddingTop: 70, backgroundColor: "#353535" }}
    >
      <div onClick={() => setIsOpen(!isOpen)} className="open-close-toggle ms-auto fs-5 point">
        <i className={`bi bi-chevron-${isOpen ? "left" : "right"}`} />
      </div>
    </div>
  );
};

export default connect()(AdminSidebar);
