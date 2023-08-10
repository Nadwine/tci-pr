import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ListingTypeEnum } from "../../../types/enums";
import CreateSaleForm from "../components/CreateSaleForm";
import CreateRentForm from "../components/CreateRentForm";
import { useSearchParams } from "react-router-dom";

const CreateListing = props => {
  const [searchParams, setSearchParams] = useSearchParams();
  const listingType = searchParams.get("type") as ListingTypeEnum;

  const goBack = () => {
    // clear listing type
    setSearchParams("");
  };

  return (
    <div className="create-listing-page">
      {!listingType ? "" : listingType !== "sale" && listingType !== "rent" && "URL query 'type' not provided or not valid"}
      {listingType && (
        <button onClick={() => goBack()} className="btn btn-primary">
          <i className="bi-arrow-left" />
        </button>
      )}
      {!listingType && (
        <div className="d-flex flex-column justify-content-center">
          <h1 className="ls-tight font-bolder d-flex h2 justify-content-center" style={{ marginTop: "50px", marginBottom: "45px" }}>
            What is the listing type?
          </h1>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <button className="listing-btn btn btn-primary" style={{ marginBottom: "15px" }} onClick={() => setSearchParams("type=rent")}>
              Rent
            </button>
            <button className="listing-btn btn btn-dark" style={{ marginBottom: "45px" }} onClick={() => setSearchParams("type=sale")}>
              Sale
            </button>
          </div>
        </div>
      )}
      {listingType && listingType === "sale" && <CreateSaleForm />}
      {listingType && listingType === "rent" && <CreateRentForm />}
    </div>
  );
};

export default connect()(CreateListing);
