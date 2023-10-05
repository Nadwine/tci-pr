import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Listing from "../../database/models/listing";

const LandlordViewMyListings = props => {
  const [listings, setListings] = useState<Listing[]>([]);

  const loadData = async () => {
    const res = await axios.get("/api/listing/my-listings");
    if (res.status !== 200) {
      console.error("error fetching /api/listing/my-listings");
      return;
    }
    console.log("my-listing", res.data);
    setListings(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <div>
      <h3 className="ps-md-5 ms-md-5">My Listings</h3>
      <ul className="list-group">
        {listings.map((l, i) => (
          <li key={i} className="list-group-item d-flex flex-row point px-md-5">
            <div className="d-flex flex-column ps-md-5">
              <div className="fw-bold">{l.title}</div>
              {l.PropertyForRent && <div>Rent: ${l.PropertyForRent?.rentAmount}</div>}
              {l.PropertyForSale && <div>Sale: ${l.PropertyForSale?.saleAmount}</div>}
              <div>Location: {l.Address.settlement}</div>
              <div>Enquiries: {l.EnquiryConversations?.length}</div>
            </div>
            <div className="d-flex actions ms-auto">
              <button className="btn btn-white">
                <i className="bi bi-pencil" />
              </button>
              <button className="btn btn-white">
                <i className="bi bi-trash3" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default connect()(LandlordViewMyListings);
