import axios from "axios";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";
import Listing from "../../../database/models/listing";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import { Chart as Chartjs } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useNavigate } from "react-router-dom";

Chartjs.register(CategoryScale);

export const LandlordDashboard = props => {
  const navigate = useNavigate();
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
    <div className="d-flex row ps-dm-5">
      <div>
        <div className="ms-5">
          <h3 className="fw-bold my-5 ms-5"> Dashboard</h3>
        </div>
        {/**---------------------------------- Accordion ----------------------------------------------- */}
        <Accordion defaultActiveKey="0" className="px-md-5 mx-md-5 mb-5">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <strong>Properties</strong>
            </Accordion.Header>
            <Accordion.Body>
              <div className="p-3">
                <h6 className="text-center fw-bolder">Your Listed Properties</h6>
                {noListings ? <div>You have not yet posted any property listings</div> : <></>}
                <div className="listings d-flex flex-wrap justify-content-around">
                  {listings.map((curListing, curIndex) => {
                    const offers = curListing.Offers;
                    const numOfOffers = offers?.length || 0;
                    const hasOffers = curListing?.Offers!.length > 0;
                    const isBasic_or_Standard = curListing.productPackage?.name === "basic" || curListing.productPackage?.name === "standard";
                    const showPayNowButton = curListing.isApproved && curListing.hasPaid === false && isBasic_or_Standard;

                    return (
                      <div
                        onClick={() => {
                          if (curListing.hasPaid === false) {
                            toast.info("This listing is still pending for payment. Please proceed with the  'Pay Now'  button to access management tools");
                            return;
                          }
                          navigate(`/manage-property/rent/${curListing.id}`);
                        }}
                        key={curIndex}
                        className="card shadow-lg point"
                        style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}
                      >
                        <img src={curListing.ListingMedia.find(m => m.mediaType === "image")?.mediaUrl} className="card-img-top" alt="..."></img>
                        <div className="card-body">
                          <h6 className="card-title">{curListing.title}</h6>
                          <p className="card-text w-100">
                            {curListing.Address.addressLine1}

                            {curListing.listingStatus === "awaiting approval" && (
                              <span className="badge rounded-pill bg-warning text-dark float-end head-bold" style={{ fontSize: "12px" }}>
                                {curListing.listingStatus}
                              </span>
                            )}
                            {curListing.listingStatus === "approved" && (
                              <span className="badge rounded-pill bg-success text-light float-end head-bold" style={{ fontSize: "12px" }}>
                                {curListing.listingStatus}
                              </span>
                            )}
                          </p>
                          <div>
                            Offers: <span className={`badge rounded-pill bg-${hasOffers ? "danger" : "secondary"}`}>{numOfOffers}</span>
                          </div>
                          <div className="d-flex" style={{ height: "32px", paddingTop: "5px" }}>
                            <div className="text-muted">
                              {curListing?.productPackage!.name.charAt(0).toUpperCase() + curListing?.productPackage?.name.slice(1)} Package
                            </div>
                            {showPayNowButton && (
                              <button
                                onClick={() => (window.location.pathname = `/api/payment/package/${curListing.id}`)}
                                className="btn btn-sm text-primary strong-text ms-auto"
                              >
                                <i className="bi bi-credit-card-fill pe-1" />
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {/* <Accordion className=" px-md-5 mx-md-5">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <strong>Tenancies</strong>
            </Accordion.Header>
            <Accordion.Collapse eventKey="0">
              <p>You have no active tenancies</p>
            </Accordion.Collapse>
          </Accordion.Item>
        </Accordion> */}
      </div>
    </div>
  );
};

export default connect()(LandlordDashboard);
