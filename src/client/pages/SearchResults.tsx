import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Listing from "../../database/models/listing";

const SearchResults = props => {
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("searchText");
  const listingType = searchParams.get("listingType");
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [serverError, setServerError] = useState("");

  const fetchSearchResult = async () => {
    const res =
      listingType === "rent"
        ? await axios.get(`/api/listing/rent/search?location=${searchText}`)
        : await axios.get(`/api/listing/sale/search?location=${searchText}`);
    if (res.status === 200) setSearchResults(res.data);
    if (res.status !== 200) setServerError("Error getting results");
  };

  useEffect(() => {
    fetchSearchResult();
  }, []);

  return (
    <div className="search-results d-flex row flex-wrap row-cols-auto">
      <div className="filter col-12 col-md-4 col-lg-4 col-xl-4">
        <div className="card">
          <div className="card-body">Search & Filter</div>
        </div>
      </div>
      <div className="list col-12 col-md-8 col-lg-8 col-xl-8">
        {searchResults.map((listing, i) => (
          <div key={i} className="card mb-3">
            <div className="card-body">
              <img width={100} src={listing.ListingMedia[0]?.mediaUrl} />
              {listing.title}
              {"  $"}
              {listing.PropertyForRent.rentAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect()(SearchResults);
