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

  const mql = window.matchMedia("(max-width: 600px)");

  let mobileView = mql.matches;

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
    <div className="home justify-content-center align-items-center" style={{ paddingLeft: "0px", paddingTop: "0px", paddingRight: "0px" }}>
      <div className="welcome-search justify-content-center">
        <div className="justify-content-center align-items-center">
          <img
            src="/static/banner-img3.jpg"
            style={{ position: "absolute", padding: "0px", maxHeight: "350px", marginLeft: "0px" }}
            className="banner-img"
          ></img>
          <h1 className="text-light" style={{ zIndex: +1, position: "relative", paddingTop: "80px", color: "white", textAlign: "center" }}>
            The Perfect Space Awaits
          </h1>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <div className="col-12 col-md-8 mt-5 border border-light px-2 pt-3" style={{ zIndex: +1, position: "relative", borderRadius: "15px" }}>
            <div className="input-group mb-3">
              <input onChange={e => setSearchText(e.target.value)} type="text" className="form-control" placeholder="Try 'provo' or 'Providenciales'" />
              <div className="input-group-append">
                <button onClick={() => searchRent()} className="btn btn-dark">
                  Rent
                </button>
              </div>
              <div className="input-group-append">
                <button onClick={() => searchSale()} className="btn btn-primary">
                  Sale
                </button>
              </div>
            </div>
          </div>
        </div>
        {/**Small screen -------------------------------------------------------------> */}
        {mobileView && (
          <div className="suggestions text-center text-dark" style={{ zIndex: +1, position: "relative", marginTop: "130px" }}>
            <div className="card shadow-sm" style={{ marginBottom: "10px" }}>
              <div className="card-body">
                <i className="bi bi-house-fill"></i> Recent properties for rent {"(dummy)"}
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <i className="bi bi-coin"></i> Recent properties for sale {"(dummy)"}
              </div>
            </div>
          </div>
        )}
        {/**Big screen -------------------------------------------------------------> */}
        {!mobileView && (
          <div className="col-12 d-flex justify-content-center" style={{ marginTop: "100px" }}>
            <div className="card" style={{ width: "15rem", marginTop: "25px", marginRight: "20px" }}>
              <img src="/static/banner-img3.jpg" className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the content.</p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
            <div className="card" style={{ width: "15rem", marginTop: "25px", marginRight: "20px" }}>
              <img src="/static/banner-img2.jpg" className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the content.</p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
            <div className="card" style={{ width: "15rem", marginTop: "25px", marginRight: "20px" }}>
              <img src="/static/banner-img1.jpg" className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the content.</p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect()(Home);
