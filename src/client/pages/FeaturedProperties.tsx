import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Listing from "../../database/models/listing";
import axios from "axios";
import { toast } from "react-toastify";

export const FeaturedProperties = props => {
  const [randListings, setRandListings] = useState<Listing[]>();

  const listing1 = randListings && randListings[0];
  const listing2 = randListings && randListings[1];
  const listing3 = randListings && randListings[2];

  const loadRandListings = async () => {
    const res = await axios.get("/api/listing/random");
    if (res.status == 200) {
      setRandListings(res.data);
    } else {
      toast.error(`Internal Server Error 101`);
    }
  };

  useEffect(() => {
    loadRandListings();
  }, []);

  return (
    <div className="text-center">
      <h5 className="mt-5 fw-bolder mb-2">Featured Properties</h5>
      <div className="col-12 d-flex justify-content-center">
        <div className="card shadow-sm" style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}>
          <img src={listing1?.ListingMedia[0].mediaUrl} className="card-img-top" alt="..."></img>
          <div className="card-body shadow-lg">
            <h5 className="card-title">{listing1?.title}</h5>
            <p>
              <a className="link-dark link-underline-light" href={`property/rent/${listing1?.id}`}>
                {listing1?.Address.addressLine1}
              </a>
            </p>
          </div>
        </div>
        <div className="card shadow-lg" style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}>
          <img src={listing2?.ListingMedia[0].mediaUrl} className="card-img-top" alt="..."></img>
          <div className="card-body">
            <h5 className="card-title">{listing2?.title}</h5>
            <p className="card-text">
              <a className="link-dark link-underline-light" href={`property/rent/${listing2?.id}`}>
                {listing2?.Address.addressLine1}
              </a>
            </p>
          </div>
        </div>
        <div className="card shadow-lg" style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}>
          <img src={listing3?.ListingMedia[0].mediaUrl} className="card-img-top" alt="..."></img>
          <div className="card-body">
            <h5 className="card-title">{listing3?.title}</h5>
            <p className="card-text">
              <a className="link-dark link-underline-light" href={`property/rent/${listing3?.id}`}>
                {listing3?.Address.addressLine1}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(FeaturedProperties);
