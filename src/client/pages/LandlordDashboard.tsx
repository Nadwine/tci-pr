import PropTypes from "prop-types";
import React from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";

export const LandlordDashboard = props => {
  return (
    <div>
      <h3 className="fw-bold my-5 ms-5">Dashboard</h3>
      {/**---------------------------------- Accordion ----------------------------------------------- */}
      <Accordion className=" px-md-5 mx-md-5">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="light" eventKey="0" style={{ width: "100%", display: "flex" }}>
              <strong>Properties</strong>
              <i className="bi bi-chevron-down ms-auto" />
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <></>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      {/* <div className="col-12 d-flex justify-content-center" style={{ marginTop: "150px" }}>
            <div className="card" style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}>
              <img src={listing1?.ListingMedia[0].mediaUrl} className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">{listing1?.title}</h5>
                <p>
                  <a className="link-dark link-underline-light" href={`property/rent/${listing1?.id}`}>
                    {listing1?.Address.addressLine1}
                  </a>
                </p>
              </div>
            </div> */}
    </div>
  );
};

export default connect()(LandlordDashboard);
