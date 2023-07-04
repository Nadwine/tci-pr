import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import axios from "axios";
import Listing from "../../database/models/listing";

const Home = props => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Listing[]>([]);

  const searchRent = async () => {
    navigate(`/search?searchText=${searchText}&listingType=rent`);
  };

  const searchSale = async () => {
    navigate(`/search?searchText=${searchText}&listingType=sale`);
  };

  console.log(searchParams);
  return (
    <div className="home justify-content-center">
      {/* <WelcomeSearch searchRent={searchRent} searchSale={searchSale} setSearchText={setSearchText} /> */}
      <div className="welcome-search">
        <div className="col-lg-12 text-center mt-5 pt-5">
          <h1>Welcome to TCI HomeBase</h1>
        </div>
        <div className="col-md-10 mt-5 border border-secondary px-2 pt-3">
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
        <div className="suggestions text-center text-primary mt-5">
          Recent properties for rent <br />
          Recent properties for sale
          <br />
        </div>
      </div>
    </div>
  );
};

export default connect()(Home);
