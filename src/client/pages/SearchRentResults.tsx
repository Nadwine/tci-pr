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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTextFromURL = searchParams.get("searchText") || "";
  const pageFromURL = searchParams.get("page") || "0";
  const minPriceFromURL = searchParams.get("minPrice");
  const maxPriceFromURL = searchParams.get("maxPrice");
  const minBedFromURL = searchParams.get("minBed");
  const maxBedFromURL = searchParams.get("maxBed");
  const minBathFromURL = searchParams.get("minBath");
  const maxBathFromURL = searchParams.get("maxBath");
  const billsIncludedFromURL = searchParams.get("bills");
  const furnishedFromURL = searchParams.get("furnished");
  const [searchText, setSearchText] = useState(searchTextFromURL);
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(pageFromURL);
  const [serverError, setServerError] = useState("");

  const generateUrlQuery = () => {
    let urlQuery = `/api/listing/rent/search?location=${searchTextFromURL}&page=${pageFromURL}`;
    if (minPriceFromURL) urlQuery = urlQuery + `&minPrice=${minPriceFromURL}`;
    if (maxPriceFromURL) urlQuery = urlQuery + `&maxPrice=${maxPriceFromURL}`;
    if (minBedFromURL) urlQuery = urlQuery + `&minBed=${minBedFromURL}`;
    if (maxBedFromURL) urlQuery = urlQuery + `&maxBed=${maxBedFromURL}`;
    if (minBathFromURL) urlQuery = urlQuery + `&minBath=${minBathFromURL}`;
    if (maxBathFromURL) urlQuery = urlQuery + `&maxBath=${maxBathFromURL}`;
    if (billsIncludedFromURL) urlQuery = urlQuery + `&bills=${billsIncludedFromURL}`;
    if (furnishedFromURL) urlQuery = urlQuery + `&furnished=${furnishedFromURL}`;

    return urlQuery;
  };

  const fetchInitialSearchResult = async () => {
    const res = await axios.get(generateUrlQuery());
    if (res.status === 200) {
      setSearchResults(res.data.rows);
      setTotalResults(res.data.count);
    }
    if (res.status !== 200) setServerError("Error getting results");
  };

  useEffect(() => {
    fetchInitialSearchResult();
  }, [searchParams]);

  const goToNextPage = async () => {
    const newPage = Number(pageFromURL) + 1;
    setPage(`${newPage}`);
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${newPage}`);
    setSearchParams(updatedSearchParams.toString());
    window.scrollTo(0, 0);
  };

  const goToPrevPage = async () => {
    const newPage = Number(pageFromURL) - 1;
    setPage(`${newPage}`);
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${newPage}`);
    setSearchParams(updatedSearchParams.toString());
    window.scrollTo(0, 0);
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
    <div className="search-results d-flex row-cols-auto flex-wrap">
      <div className="w-100 text-center text-danger">{serverError}</div>
      <div className="filter col-12 col-md-4 col-lg-4 col-xl-4">
        <FilterSearchMobile setSearchText={setSearchText} searchText={searchText} searchRent={searchRent} />
        <FilterSearchDesktop setSearchText={setSearchText} searchText={searchText} searchRent={searchRent} />
      </div>
      <div style={{ minHeight: "70vh" }} className="list col-12 col-md-8 col-lg-8 col-xl-8">
        {searchResults.map((listing, i) => (
          <div key={i} className="card mb-3">
            <div className="card-body d-flex flex-wrap">
              <div onClick={() => viewProperty(listing.id)} className="image-container point col-12 col-md-5 me-2 pb-3">
                {listing.ListingMedia[0].mediaType === "image" && <img width="100%" src={listing.ListingMedia[0]?.mediaUrl} />}
                {listing.ListingMedia[0].mediaType === "video" && <video width="100%" src={listing.ListingMedia[0]?.mediaUrl} />}
                <div className="price fw-bold fs-5" style={{ backgroundColor: "#ebf8ff", borderBottomLeftRadius: "7px", borderBottomRightRadius: "7px" }}>
                  {"$"}
                  {listing?.PropertyForRent.rentAmount} <span style={{ fontSize: "0.6em" }}>Monthly</span>{" "}
                </div>
              </div>
              <div className="info col-12 col-md-6 overflow-hidden">
                <div onClick={() => viewProperty(listing.id)} className="title fw-bold col-12 point">
                  {listing.title}
                  <div className="availability col-3 float-end" style={{ fontSize: "0.7em" }}>
                    Available {dayjs(listing?.PropertyForRent.availability).format("MMM, D, YYYY")}
                  </div>
                </div>
                <div onClick={() => viewProperty(listing.id)} className="location pt-4 point">
                  {listing.Address.settlement.charAt(0).toUpperCase() + listing.Address.settlement.slice(1)}
                </div>

                <div className="foot d-flex flex-row pt-2">
                  <div onClick={() => viewProperty(listing.id)} className="col-10 point">
                    <div className="beds pt-5">
                      <FontAwesomeIcon className="pe-1" icon={faBed} />
                      Rooms {listing.PropertyForRent.numOfRooms}
                    </div>
                    <div className="beds pt-2">
                      <FontAwesomeIcon className="pe-1" icon={faBath} />
                      Baths {listing.PropertyForRent.numOfBathRooms}
                    </div>
                  </div>
                  <div className="col-2 pt-5 mt-2 float-end">
                    <span
                      onClick={() => console.log("landlord")}
                      className="btn btn-link bg-secondary rounded-circle text-black fs-5"
                      style={{ width: "45px", height: "45px" }}
                    >
                      {listing.Admin.User?.email?.charAt(0)}
                    </span>
                  </div>
                </div>
                <div onClick={() => viewProperty(listing.id)} className="filler point" style={{ width: "100%", height: "40%" }} />
              </div>
            </div>
          </div>
        ))}
        {searchResults.length === 0 && <h6 className="text-center text-muted text-danger mt-5 pt-5">No property results to display</h6>}
      </div>
      <div
        style={{ zIndex: +1, borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px", marginTop: "40px" }}
        className="paginate py-3 col-12 d-flex justify-content-center ps-lg-5 ps-md-5 ms-lg-5 ms-md-5"
      >
        <button onClick={() => goToPrevPage()} disabled={pageFromURL === "0"} className="btn btn-primary me-4">
          Prev
        </button>
        Page {parseInt(pageFromURL) + 1}
        <button onClick={() => goToNextPage()} disabled={searchResults.length === 0} className="btn btn-primary ms-4">
          Next
        </button>
      </div>
    </div>
  );
};

export default connect()(SearchRentResults);
