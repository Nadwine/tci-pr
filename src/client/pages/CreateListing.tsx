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
        <button onClick={() => goBack()} className="btn btn-info">
          <i className="bi-arrow-left" />
        </button>
      )}
      {!listingType && (
        <div>
          Listing Type
          <button onClick={() => setSearchParams("type=rent")}>Rent</button>
          <button onClick={() => setSearchParams("type=sale")}>Sale</button>
        </div>
      )}
      {listingType && listingType === "sale" && <CreateSaleForm />}
      {listingType && listingType === "rent" && <CreateRentForm />}
    </div>
  );
};

export default connect()(CreateListing);
