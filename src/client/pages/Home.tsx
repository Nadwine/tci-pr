import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import axios from "axios";
import Listing from "../../database/models/listing";

const Home = props => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");

  const searchRent = async () => {
    let searchTextTransform = searchText;
    if (searchText.toLowerCase() === "provo") {
      setSearchText("providenciales");
      searchTextTransform = "providenciales";
    }

    navigate(`/search/rent?searchText=${searchTextTransform}&page=0`);
  };

  const searchSale = async () => {
    let searchTextTransform = searchText;
    if (searchText.toLowerCase() === "provo") {
      setSearchText("providenciales");
      searchTextTransform = "providenciales";
    }

    navigate(`/search/sale?searchText=${searchTextTransform}&page=0`);
  };

  console.log(searchParams);
  return (
    <div className="home justify-content-center">
      <div className="welcome-search">
        <div className="col-12 text-center mt-5 pt-5">
          <h1>Welcome to TCI HomeBase</h1>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <div className="col-12 col-md-8 mt-5 border border-secondary px-2 pt-3">
            <div className="input-group mb-3">
              <input onChange={e => setSearchText(e.target.value)} type="text" className="form-control" placeholder="Search ......" />
              <div className="input-group-append">
                <button onClick={() => searchRent()} className="btn btn-dark">
                  Rent
                </button>
              </div>
              <div className="input-group-append">
                <button onClick={() => searchSale()} className="btn btn-info">
                  Sale
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="suggestions text-center text-primary mt-5">
          Recent properties for rent {"(dummy)"} <br />
          Recent properties for sale {"(dummy)"}
          <br />
        </div>
      </div>
    </div>
  );
};

export default connect()(Home);
