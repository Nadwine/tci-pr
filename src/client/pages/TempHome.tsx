import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import axios from "axios";
import Listing from "../../database/models/listing";
import islands from "../../utils/islandsData.json";
import { toast } from "react-toastify";

let islandAndSettlements: string[] = [];

islands.forEach(i => {
  islandAndSettlements.push(i.name);
  islandAndSettlements = [...islandAndSettlements, ...i.settlements];
});

const TempHome = props => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [randListings, setRandListings] = useState<Listing[]>();

  const listing1 = randListings && randListings[0];
  const listing2 = randListings && randListings[1];
  const listing3 = randListings && randListings[2];
  const listing4 = randListings && randListings[3];

  const mql = window.matchMedia("(max-width: 600px)");

  let mobileView = mql.matches;

  const loadRandListings = async () => {
    const res = await axios.get("/api/listing/random");
    if (res.status == 200) {
      setRandListings(res.data);
    } else {
      toast.error(`Internal Server Error 101`);
    }
  };

  const searchRent = async () => {
    let searchTextTransform = searchText;
    if (searchText.toLowerCase() === "provo") {
      setSearchText("providenciales");
      searchTextTransform = "providenciales";
    }

    navigate(`/search/rent?searchText=${searchTextTransform}&page=0`);
  };

  useEffect(() => {}, [searchText]);

  const searchSale = async () => {
    let searchTextTransform = searchText;
    if (searchText.toLowerCase() === "provo") {
      setSearchText("providenciales");
      searchTextTransform = "providenciales";
    }

    navigate(`/search/sale?searchText=${searchTextTransform}&page=0`);
  };

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      searchRent();
    }
  }

  useEffect(() => {
    loadRandListings();
  }, []);

  const autoCompleteFilterWithSearch = islandAndSettlements.filter(c => c.toLowerCase().includes(searchText.toLowerCase()));
  const showAutoComplete = searchText && autoCompleteFilterWithSearch.length !== 0;

  return (
    <div className="home justify-content-center align-items-center" style={{ paddingLeft: "0px", paddingTop: "0px", paddingRight: "0px" }}>
      <div className="welcome-search justify-content-center">
        <div className="justify-content-center align-items-center">
          <img
            src="/static/home-photo.jpg"
            style={{ position: "absolute", padding: "0px", maxHeight: "360px", marginLeft: "0px" }}
            className="banner-img"
          ></img>
          <h1 className="text-light" style={{ zIndex: +1, position: "relative", paddingTop: "80px", color: "white", textAlign: "center" }}>
            The Perfect Space Awaits
          </h1>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <div className="col-12 col-md-8 mt-5 border border-light px-2 p-3" style={{ zIndex: +1, position: "relative", borderRadius: "15px" }}>
            <div className="input-group">
              <input
                value={searchText}
                onKeyUp={handleKeyUp}
                onChange={e => setSearchText(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Try 'provo' or 'Providenciales'"
              />
              <div className="input-group-append">
                <button onClick={() => searchRent()} className="btn btn-dark">
                  Search
                </button>
              </div>
              {/* <div className="input-group-append">
                <button onClick={() => searchSale()} className="btn btn-primary">
                  Sale
                </button>
              </div> */}
            </div>
            {showAutoComplete && (
              <div className="homepage-autocomplete bg-light mb-3 position-absolute p-3 rounded" style={{ opacity: 0.9 }}>
                {autoCompleteFilterWithSearch.map((c, i) => (
                  <div key={i} className="autocomplete-item point autocomplete-highlight" onClick={() => setSearchText(c)}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/**Small screen -------------------------------------------------------------> */}
        {mobileView && (
          <div className="suggestions text-center text-dark" style={{ zIndex: +1, position: "relative", marginTop: "130px" }}>
            <div className="card shadow-sm" style={{ marginBottom: "10px" }}>
              <div className="card-body">
                <i className="bi bi-house-fill"></i> Long Term Leases {"(dummy)"}
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <i className="bi bi-coin"></i> Short Term Leases {"(dummy)"}
              </div>
            </div>
          </div>
        )}
        {/**Big screen -------------------------------------------------------------> */}
        {!mobileView && (
          <div>
            <p>Dummy</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect()(TempHome);
