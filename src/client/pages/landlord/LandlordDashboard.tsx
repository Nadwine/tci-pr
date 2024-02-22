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
    <div className="d-flex row ps-dm-5" style={{ backgroundColor: "white" }}>
      <div>
        <h3 className="fw-bold my-5 ms-5"> Dashboard</h3>
        {/**---------------------------------- Accordion ----------------------------------------------- */}
        <Accordion defaultActiveKey="0" className="px-md-5 mx-md-5">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="light" eventKey="0" style={{ width: "100%", display: "flex" }}>
                <strong>Properties</strong>
                <i className="bi bi-chevron-down ms-auto" />
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <div className="p-3">
                <h6 className="text-center fw-bolder">Your Listed Properties</h6>
                {noListings ? <div>You have not yet posted any property listings</div> : <></>}
                <div className="listings d-flex flex-wrap justify-content-around">
                  {listings.map((curListing, curIndex) => {
                    const offers = curListing.Offers;
                    const numOfOffers = offers?.length || 0;
                    const hasOffers = curListing?.Offers!.length > 0;

                    return (
                      <div
                        onClick={() => navigate(`/manage-property/rent/${curListing.id}`)}
                        key={curIndex}
                        className="card shadow-lg point"
                        style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}
                      >
                        <img src={curListing.ListingMedia[0].mediaUrl} className="card-img-top" alt="..."></img>
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion defaultActiveKey="0" className=" px-md-5 mx-md-5">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="light" eventKey="0" style={{ width: "100%", display: "flex" }}>
                <strong>Tenancies</strong>
                <i className="bi bi-chevron-down ms-auto" />
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <p>You have no tenancies</p>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <div className="m-5" style={{ height: "490px", width: "910px", justifyContent: "center" }}>
          <Bar
            data={{
              labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
              datasets: [
                {
                  label: "New Users",
                  data: [10, 20, 10, 30, 20, 40]
                }
              ]
            }}
          ></Bar>
        </div>

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
    </div>
  );
};

export default connect()(LandlordDashboard);
