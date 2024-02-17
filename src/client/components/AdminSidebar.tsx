import PropTypes from "prop-types";
import React, { useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";
import AdminApproveListingsTable from "./AdminApproveListingsTable";
import { useNavigate } from "react-router-dom";

const AdminSidebar = props => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // closed width 50px
  return (
    <div
      className="d-flex position-fixed flex-column text-white bg-dark"
      style={{ zIndex: 999, top: 0, left: 0, height: "100vh", width: isOpen ? 250 : 50, paddingTop: 70, overflow: "hidden" }}
    >
      <div onClick={() => setIsOpen(!isOpen)} className="open-close-toggle ms-auto fs-5 point">
        <i className={`bi bi-chevron-${isOpen ? "left" : "right"}`} />
      </div>
      {isOpen && (
        <div>
          <ul className="list-group mt-3 bg-dark">
            <li className="list-group-item bg-dark text-light border-0 point" onClick={() => navigate("admin/dashboard/listing-for-aproval")}>
              <i className="bi bi-check-square-fill"></i> Approve listing
            </li>
            <li className="list-group-item bg-dark text-light border-0 point" onClick={() => navigate("admin/dashboard/listings")}>
              <i className="bi bi-card-list"></i> View Listings
            </li>
            <li className="list-group-item bg-dark text-light border-0 point" onClick={() => navigate("admin/dashboard/landlords")}>
              <i className="bi bi-house-fill"></i> View Landlords
            </li>
            <li className="list-group-item bg-dark text-light border-0 point" onClick={() => navigate("admin/dashboard/users")}>
              <i className="bi bi-people-fill"></i> View Users{" "}
            </li>
          </ul>
        </div>
      )}
      {!isOpen && (
        <div>
          <ul className="list-group mt-3">
            <li className="list-group-item pe-2 ps-1 bg-dark text-light border-0 point" onClick={() => navigate("admin/dashboard/listing-for-aproval")}>
              <i className="bi bi-check-square-fill text-light"></i>
            </li>
            <li className="list-group-item pe-2 ps-1 bg-dark text-light border-0 point" onClick={() => navigate("admin/dashboard/listings")}>
              <i className="bi bi-card-list text-light"></i>
            </li>
            <li className="list-group-item pe-2 ps-1 bg-dark text-light border-0 point" onClick={() => navigate("admin/dashboard/landlords")}>
              <i className="bi bi-house-fill text-light"></i>
            </li>
            <li className="list-group-item pe-2 ps-1 bg-dark text-light border-0 point" onClick={() => navigate("admin/dashboard/users")}>
              <i className="bi bi-people-fill text-light"></i>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default connect()(AdminSidebar);
