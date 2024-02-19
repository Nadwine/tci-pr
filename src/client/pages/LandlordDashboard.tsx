import axios from "axios";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";
import Listing from "../../database/models/listing";
import { toast } from "react-toastify";

export const LandlordDashboard = props => {
  const [listings, setListings] = useState<Listing[]>([]);

  const initFetch = async () => {
    const res = await axios.get("/api/listing/landlord/my-listings");
    if (res.status !== 200) toast.error("Failed to load data");
    setListings(res.data);
  };

  useEffect(() => {
    initFetch();
  }, []);

  const noListings = listings.length === 0;
  return (
    <div>
      <h3 className="fw-bold my-5 ms-5"> Dashboard</h3>
      {/**---------------------------------- Accordion ----------------------------------------------- */}
      <Accordion defaultActiveKey="0" className=" px-md-5 mx-md-5">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="light" eventKey="0" style={{ width: "100%", display: "flex" }}>
              <strong>Properties</strong>
              <i className="bi bi-chevron-down ms-auto" />
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <div className="p-3">
              <h6 className="text-center">Your Listed Property</h6>
              {noListings ? <div>You have not yet posted any property listings</div> : <></>}
              <div className="listings d-flex flex-wrap justify-content-around">
                {listings.map((curListing, curIndex) => (
                  <div key={curIndex} className="card shadow-lg" style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}>
                    <img src={curListing.ListingMedia[0].mediaUrl} className="card-img-top" alt="..."></img>
                    <div className="card-body">
                      <h5 className="card-title">{curListing.title}</h5>
                      <p className="card-text w-100">
                        <a className="link-dark link-underline-light" href={`/property/rent/${curListing.id}`}>
                          {curListing.Address.addressLine1}
                        </a>
                        <span className="float-end" style={{ fontSize: "12px", color: "#f499a9" }}>
                          {curListing.listingStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
