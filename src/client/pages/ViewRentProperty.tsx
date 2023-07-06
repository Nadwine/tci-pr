import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import Listing from "../../database/models/listing";
import dayjs from "dayjs";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";

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
    }
  };

  useEffect(() => {
    initialFetch();
  }, []);

  if (loading) return <LoadingSpinnerWholePage />;
  return (
    <div>
      {listing && (
        <div className="card mb-3">
          <div className="card-body d-flex flex-wrap">
            <div className="image-container col-12 col-md-5 me-2 pb-3">
              <img width="100%" src={listing.ListingMedia[0]?.mediaUrl} />
              <div className="price fw-bold fs-5" style={{ backgroundColor: "#ebf8ff", borderBottomLeftRadius: "7px", borderBottomRightRadius: "7px" }}>
                {"$"}
                {listing?.PropertyForRent.rentAmount} <span style={{ fontSize: "0.6em" }}>Monthly</span>{" "}
              </div>
            </div>
            <div className="info col-12 col-md-6">
              <div className="title fw-bold col-12">
                {listing.title}
                <div className="availability col-3 float-end" style={{ fontSize: "0.7em" }}>
                  Available {dayjs(listing?.PropertyForRent.availability).format("MMM, D, YYYY")}
                </div>
              </div>
              <div className="location">{listing.Address.settlement.charAt(0).toUpperCase() + listing.Address.settlement.slice(1)}</div>

              <div className="foot d-flex flex-row">
                <div className="col-10">
                  <div className="beds pt-5">
                    <i className="bi-door-closed pe-1" />
                    Rooms {listing.PropertyForRent.numOfRooms}
                  </div>
                  <div className="beds pt-2">
                    <i className="bi-water pe-1" />
                    Baths {listing.PropertyForRent.numOfRooms}
                  </div>
                </div>
                <div className="col-2 pt-5 mt-2 float-end">
                  <span
                    onClick={() => console.log("landlord")}
                    className="btn btn-link bg-secondary rounded-circle text-black fs-5"
                    style={{ width: "45px", height: "45px" }}
                  >
                    {listing.Landlord.User?.email?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect()(ViewRentProperty);
