import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Listing from "../../database/models/listing";
import FilterSearchMobile from "../components/FilterSearchMobile";
import FilterSearchDesktop from "../components/FilterSearchDesktop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const SearchRentResults = props => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTextFromURL = searchParams.get("searchText") || "";
  const pageFromURL = searchParams.get("page") || "1";
  const [searchText, setSearchText] = useState(searchTextFromURL);
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(pageFromURL);
  const [serverError, setServerError] = useState("");

  const fetchInitialSearchResult = async () => {
    const res = await axios.get(`/api/listing/rent/search?location=${searchTextFromURL}&page=${page}`);
    if (res.status === 200) {
      setSearchResults(res.data.rows);
      setTotalResults(res.data.count);
    }
    if (res.status !== 200) setServerError("Error getting results");
  };

  useEffect(() => {
    fetchInitialSearchResult();
  }, []);

  const addFilter = (property: string, values: []) => {
    //
  };

  const goToNextPage = async () => {
    const newPage = Number(page) + 1;
    setPage(`${newPage}`);
    navigate(`/search/rent?searchText=${searchText}&page=${newPage}`);
    const res = await axios.get(`/api/listing/rent/search?location=${searchTextFromURL}&page=${newPage}`);
    if (res.status === 200) {
      setSearchResults(res.data.rows);
      setTotalResults(res.data.count);
    }
    if (res.status !== 200) setServerError("Error getting results");
  };

  const goToPrevPage = async () => {
    const newPage = Number(page) - 1;
    setPage(`${newPage}`);
    navigate(`/search/rent?searchText=${searchText}&page=${newPage}`);
    const res = await axios.get(`/api/listing/rent/search?location=${searchTextFromURL}&page=${newPage}`);
    if (res.status === 200) {
      setSearchResults(res.data.rows);
      setTotalResults(res.data.count);
    }
    if (res.status !== 200) setServerError("Error getting results");
  };

  const searchRent = async () => {
    let searchTextTransform = searchText;
    if (searchText.toLowerCase() === "provo") {
      setSearchText("providenciales");
      searchTextTransform = "providenciales";
    }

    navigate(`/search/rent?searchText=${searchTextTransform}&page=0`);
    const res = await axios.get(`/api/listing/rent/search?location=${searchTextTransform}&page=0`);
    if (res.status === 200) {
      setSearchResults(res.data.rows);
      setTotalResults(res.data.count);
    }
    if (res.status !== 200) setServerError("Error getting results");
  };

  const viewProperty = (id: number) => {
    navigate(`/property/rent/${id}`);
  };

  return (
    <div className="search-results d-flex row flex-wrap row-cols-auto">
      <div className="w-100 text-center text-danger">{serverError}</div>
      <div className="filter col-12 col-md-4 col-lg-4 col-xl-4">
        <FilterSearchMobile setSearchText={setSearchText} searchText={searchText} searchRent={searchRent} />
        <FilterSearchDesktop setSearchText={setSearchText} searchText={searchText} searchRent={searchRent} />
      </div>
      <div style={{ minHeight: "70vh" }} className="list col-12 col-md-8 col-lg-8 col-xl-8">
        {searchResults.map((listing, i) => (
          <div key={i} className="card mb-3">
            <div className="card-body d-flex flex-wrap">
              <div onClick={() => viewProperty(listing.id)} className="image-container col-12 col-md-5 me-2 pb-3">
                <img width="100%" src={listing.ListingMedia.find(m => m.label === "1")?.mediaUrl} />
                <div className="price fw-bold fs-5" style={{ backgroundColor: "#ebf8ff", borderBottomLeftRadius: "7px", borderBottomRightRadius: "7px" }}>
                  {"$"}
                  {listing?.PropertyForRent.rentAmount} <span style={{ fontSize: "0.6em" }}>Monthly</span>{" "}
                </div>
              </div>
              <div className="info col-12 col-md-6">
                <div onClick={() => viewProperty(listing.id)} className="title fw-bold col-12">
                  {listing.title}
                  <div className="availability col-3 float-end" style={{ fontSize: "0.7em" }}>
                    Available {dayjs(listing?.PropertyForRent.availability).format("MMM, D, YYYY")}
                  </div>
                </div>
                <div onClick={() => viewProperty(listing.id)} className="location pt-4">
                  {listing.Address.settlement.charAt(0).toUpperCase() + listing.Address.settlement.slice(1)}
                </div>

                <div className="foot d-flex flex-row pt-2">
                  <div onClick={() => viewProperty(listing.id)} className="col-10">
                    <div className="beds pt-5">
                      <FontAwesomeIcon className="pe-1" icon={faBed} />
                      Rooms {listing.PropertyForRent.numOfRooms}
                    </div>
                    <div className="beds pt-2">
                      <FontAwesomeIcon className="pe-1" icon={faBath} />
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
        ))}
      </div>
      <div
        style={{ zIndex: +1, backgroundColor: "#e5e5e5", borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }}
        className="paginate py-3 col-12 d-flex justify-content-center"
      >
        <button onClick={() => goToPrevPage()} disabled={page === "0"} className="btn btn-primary me-4">
          Perv
        </button>
        Page {page}
        <button onClick={() => goToNextPage()} className="btn btn-primary ms-4">
          Next
        </button>
      </div>
    </div>
  );
};

export default connect()(SearchRentResults);
