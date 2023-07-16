import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import Listing from "../../database/models/listing";
import dayjs from "dayjs";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faPerson } from "@fortawesome/free-solid-svg-icons";

const ViewRentProperty = props => {
  const params = useParams();
  const { id } = params;
  const [listing, setListing] = useState<Listing>();
  const [loading, setLoading] = useState(true);

  const initialFetch = async () => {
    const res = await axios.get(`/api/listing/rent/${id}`);
    if (res.status === 200) {
      setListing(res.data);
      setLoading(false);
    } else {
      console.log(`/api/listing/rent/${id}`, res);
    }
  };

  useEffect(() => {
    initialFetch();
  }, []);

  console.log(listing);
  if (loading) return <LoadingSpinnerWholePage />;
  return (
    <div>
      {listing && (
        <div className="card mb-3">
          <div className="card-body d-flex flex-wrap justify-content-center">
            <div className="image-container col-10 me-2 pb-3">
              <img width="100%" src={listing.ListingMedia[0]?.mediaUrl} />
              <div className="price fw-bold fs-5" style={{ backgroundColor: "#ebf8ff", borderBottomLeftRadius: "7px", borderBottomRightRadius: "7px" }}>
                {"$"}
                {listing?.PropertyForRent.rentAmount} <span style={{ fontSize: "0.6em" }}>Monthly</span>{" "}
              </div>
            </div>
            <div className="info col-10">
              <div className="title fw-bold col-12">
                {listing.title}
                <div className="availability col-3 float-end" style={{ fontSize: "0.7em" }}>
                  Available {dayjs(listing?.PropertyForRent.availability).format("MMM, D, YYYY")}
                </div>
              </div>
              <div className="location">{listing.Address.settlement.charAt(0).toUpperCase() + listing.Address.settlement.slice(1)}</div>

              <div className="foot d-flex flex-row">
                <div className="col-9">
                  <div className="rooms pt-5">
                    <FontAwesomeIcon className="pe-1" icon={faBed} />
                    Rooms {listing.PropertyForRent.numOfRooms}
                  </div>
                  <div className="beds pt-2">
                    <FontAwesomeIcon className="pe-1" icon={faBath} />
                    Baths {listing.PropertyForRent.numOfRooms}
                  </div>
                  <div className="tenants pt-2">
                    <FontAwesomeIcon className="pe-1" icon={faPerson} />
                    Tenants {listing.PropertyForRent.maxTenant}
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem" }} className="col-3 pt-5 mt-2 float-end">
                  <div className="fw-bold">Address</div>
                  <div>{listing.Address.addressLine1}</div>
                  <div>{listing.Address.addressLine2}</div>
                  <div>{listing.Address.city}</div>
                </div>
              </div>
              <hr />
              <h5 className="text-secondary">Description</h5>
              <div style={{ minHeight: "5rem" }} className="description card text-secondary p-2">
                {listing.description}
              </div>
              <div className="bills text-secondary pt-3">
                Bills:
                {listing.PropertyForRent.billsIncluded ? (
                  <span className="ps-1">
                    Included <i className="text-success fw-bold bi-check-circle-fill" />
                  </span>
                ) : (
                  <span className="ps-1">
                    Not Included <i className="text-danger fw-bold bi-x-circle-fill" />
                  </span>
                )}{" "}
              </div>
              <div className="sqft"></div>
              <hr />
              <div className="text-secondary">
                <h6>Contact Details</h6>
                <div>Email: {listing.Landlord.User?.email}</div>
                <div>Phone: {listing.Landlord.phone || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect()(ViewRentProperty);
