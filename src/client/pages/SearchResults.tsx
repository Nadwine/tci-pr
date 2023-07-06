import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Listing from "../../database/models/listing";
import FilterSearchMobile from "../components/FilterSearchMobile";
import FilterSearchDesktop from "../components/FilterSearchDesktop";
import dayjs from "dayjs";

const SearchResults = props => {
  const [searchParams] = useSearchParams();
  const searchTextFromURL = searchParams.get("searchText") || "";
  const pageFromURL = searchParams.get("page") || "1";
  const listingType = searchParams.get("listingType");
  const [searchText, setSearchText] = useState(searchTextFromURL);
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [page, setPage] = useState(pageFromURL);
  const [serverError, setServerError] = useState("");

  const fetchInitialSearchResult = async () => {
    const res =
      listingType === "rent"
        ? await axios.get(`/api/listing/rent/search?location=${searchTextFromURL}&page=${page}`)
        : await axios.get(`/api/listing/sale/search?location=${searchTextFromURL}&page=${page}`);
    if (res.status === 200) setSearchResults(res.data);
    if (res.status !== 200) setServerError("Error getting results");
  };

  useEffect(() => {
    fetchInitialSearchResult();
  }, []);

  return (
    <div className="search-results d-flex row flex-wrap row-cols-auto">
      <div className="w-100 text-center text-danger">{serverError}</div>
      <div className="filter col-12 col-md-4 col-lg-4 col-xl-4">
        <FilterSearchMobile setSearchText={setSearchText} searchText={searchText} />
        <FilterSearchDesktop setSearchText={setSearchText} searchText={searchText} />
      </div>
      <div className="list col-12 col-md-8 col-lg-8 col-xl-8">
        {searchResults.map((listing, i) => (
          <div key={i} className="card mb-3">
            <div className="card-body d-flex flex-wrap">
              <div className="image-container col-12 col-md-5 me-2">
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
                <div>{listing.Address.settlement.charAt(0).toUpperCase() + listing.Address.settlement.slice(1)}</div>

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
                    <span className="btn btn-link bg-secondary rounded-circle text-black fs-5" style={{ width: "45px", height: "45px" }}>
                      {listing.Landlord.User?.email?.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect()(SearchResults);
