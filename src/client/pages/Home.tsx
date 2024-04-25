import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import axios from "axios";
import Listing from "../../database/models/listing";
import islands from "../../utils/islandsData.json";
import { toast } from "react-toastify";
import { faClipboardList, faLayerGroup, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LandlordProposalButton from "../components/landlord/LandlordProposalButton";
import SEOHelmetTags from "../components/SEOHelmetTags";

let islandAndSettlements: string[] = [];

islands.forEach(i => {
  islandAndSettlements.push(i.name);
  islandAndSettlements = [...islandAndSettlements, ...i.settlements];
});

const Home = props => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  // const [randListings, setRandListings] = useState<Listing[]>();

  // const listing1 = randListings && randListings[0];
  // const listing2 = randListings && randListings[1];
  // const listing3 = randListings && randListings[2];

  const mql = window.matchMedia("(max-width: 600px)");

  let mobileView = mql.matches;

  // const loadRandListings = async () => {
  //   const res = await axios.get("/api/listing/random");
  //   if (res.status == 200) {
  //     setRandListings(res.data);
  //   } else {
  //     toast.error(`Internal Server Error 101`);
  //   }
  // };

  const searchRent = async (text?: string) => {
    let searchTextTransform = text || searchText;
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

  function clickSearchCard() {
    document.getElementById("home-search-input")?.focus();
  }

  useEffect(() => {
    // loadRandListings();
  }, []);

  const autoCompleteFilterWithSearch = islandAndSettlements.filter(c => c.toLowerCase().includes(searchText.toLowerCase()));
  const showAutoComplete = searchText && autoCompleteFilterWithSearch.length !== 0;

  return (
    <div
      className="home justify-content-center align-items-center"
      style={{ paddingLeft: "0px", paddingTop: "0px", paddingRight: "0px", backgroundColor: "white" }}
    >
      <SEOHelmetTags
        title="TCI Homebase - Search and list properties for rent in the Turks and Caicos Islands"
        description="The #1 destination for landlords advertising their rental property and residents looking to find their next rental home"
        type="website"
      />
      <div className="welcome-search justify-content-center">
        <div className="justify-content-center shadow-sm align-items-center" style={{ height: "270px", marginLeft: "0px" }}>
          <div
            className="image-container"
            style={{
              position: "absolute",
              padding: "0px",
              maxHeight: "350px",
              marginLeft: "0px",
              width: "100%",
              filter: "sepia(5%) saturate(150%) brightness(70%) hue-rotate(341deg)",
              overflow: "hidden"
            }}
          >
            <img src="/static/home-photo3.jpg" style={{ position: "relative", marginTop: "-250px", width: 2000 }} className="home-photo.jpg"></img>
          </div>
          <h1
            className="position-absolute fw-bold text-center w-100 mb-lg-3 mt-lg-2 mt-sm-5 mb-sm-2 px-3 pb-4"
            style={{ zIndex: +1, position: "relative", paddingTop: "60px", textAlign: "center", color: "white" }}
          >
            The Perfect Space Awaits
          </h1>
        </div>
        <div className="position-absolute col-12 d-flex justify-content-center" style={{ top: 150 }}>
          <div className="col-12 col-md-8 mt-5 border border-light px-2 p-3" style={{ zIndex: +1, position: "relative", borderRadius: "15px" }}>
            <div className="input-group">
              <input
                value={searchText}
                onKeyUp={handleKeyUp}
                onChange={e => setSearchText(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Try 'provo' or 'kew'"
                id="home-search-input"
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
                  <div
                    key={i}
                    className="autocomplete-item point autocomplete-highlight"
                    onClick={() => {
                      setSearchText(c);
                      searchRent(c);
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-center fs-6" style={{ marginTop: "130px" }}>
          <h3 className="fw-bolder px-3" style={{ color: "#055160" }}>
            Search Properties for Rent in the Turks and Caicos Islands
          </h3>
        </div>
        <div className="text-center fs-6" style={{ marginLeft: "10px", marginRight: "10px" }}>
          <p className="fst-italic " style={{ fontSize: "15px" }}>
            The{" "}
            <span className="fw-bolder" style={{ fontSize: "18px" }}>
              #1{" "}
            </span>
            destination for landlords advertising their rental property and residents looking to find their next rental home.
          </p>
        </div>
        {/**Small screen -------------------------------------------------------------> */}
        {/* {mobileView && (
          <div className="suggestions text-center text-dark" style={{ zIndex: +1, position: "relative", marginTop: "130px" }}>
            <div className="card shadow-sm" style={{ marginBottom: "10px" }}>
              <div className="card-body">
                <i className="bi bi-house-fill"></i> Long Term Rentals {"(dummy)"}
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <i className="bi bi-coin"></i> Short Term Rentals {"(dummy)"}
              </div>
            </div>
          </div>
        )} */}
        {mobileView && (
          <div>
            <p className="fs-4 px-3 text-center mt-5" style={{ color: "#055160" }}>
              FIND YOUR DREAM HOME WITH TCI HOMEBASE
            </p>
            <div>
              <div className="col-12 d-flex flex-column justify-content-center text-center" style={{ marginTop: "25px" }}>
                <div className="card align-items-center border-0 justify-content-center" style={{ width: "100%", padding: "30px", backgroundColor: "white" }}>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "100px", border: "9px solid #01acac", height: "8rem", width: "8rem", backgroundColor: "#01acac" }}
                  >
                    <FontAwesomeIcon icon={faLayerGroup} style={{ width: "3rem", height: "3rem" }} />
                  </div>
                  <div className="card-body" style={{ backgroundColor: "white" }}>
                    <h5 className="card-title fw-bolder">Free Registration</h5>
                    <p>Hassle-free registration </p>
                    <p>Guided one-on-one onboarding for landlords</p>
                  </div>
                </div>
                <div className="card align-items-center border-0 justify-content-center" style={{ width: "100%", padding: "30px", backgroundColor: "white" }}>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "100px", border: "9px solid #01acac", height: "8rem", width: "8rem", backgroundColor: "#01acac" }}
                  >
                    <FontAwesomeIcon icon={faClipboardList} style={{ width: "3rem", height: "3rem" }} />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bolder">No Dead Listings</h5>
                    <p className="card-text">Live updates on property availability </p>
                    <p>No fake adverts</p>
                  </div>
                </div>
                <div className="card align-items-center border-0 justify-content-center" style={{ width: "100%", padding: "30px", backgroundColor: "white" }}>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "100px", border: "9px solid #01acac", height: "8rem", width: "8rem", backgroundColor: "#01acac" }}
                  >
                    <FontAwesomeIcon icon={faMapLocationDot} style={{ width: "3rem", height: "3rem" }} />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bolder">Island-Wide Coverage</h5>
                    <p className="card-text">We list properties available on all our sister islands</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/**Big screen -------------------------------------------------------------> */}
        {!mobileView && (
          <div className="text-center">
            <h5 className="mt-5 fw-bolder mb-2">Take a Look</h5>
            <div className="col-12 d-flex justify-content-center">
              <div onClick={() => clickSearchCard()} className="card shadow-sm point" style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}>
                <img src="/static/home4.jpg" className="card-img-top" alt="..."></img>
                <div className="card-body shadow-lg">
                  <h6 className="card-title fw-bold" style={{ color: "#087990" }}>
                    Long & short term Leases
                  </h6>
                  <p>
                    <button className="btn text-dark ps-0" onClick={() => navigate(`/`)}></button>
                  </p>
                </div>
              </div>
              <div className="card shadow-lg point" style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}>
                <img src="/static/home1.jpg" className="card-img-top" alt="..."></img>
                <div className="card-body">
                  <h6 className="card-title fw-bolder" style={{ color: "#087990" }}>
                    List a property
                  </h6>
                  <p className="card-text">
                    <button className="btn text-dark ps-0" onClick={() => navigate(`/`)}></button>
                  </p>
                </div>
              </div>
              <div onClick={() => clickSearchCard()} className="card shadow-lg point" style={{ width: "18rem", marginTop: "25px", marginRight: "20px" }}>
                <img src="/static/home3.jpg" className="card-img-top" alt="..."></img>
                <div className="card-body">
                  <h6 className="card-title fw-bolder" style={{ color: "#087990" }}>
                    Commercial Properties for rent
                  </h6>
                  <p className="card-text">
                    <button className="btn text-dark ps-0" onClick={() => navigate(`/`)}></button>
                  </p>
                </div>
              </div>
            </div>
            <p className="fs-3 mt-5" style={{ color: "#055160" }}>
              FIND YOUR DREAM HOME WITH TCI HOMEBASE
            </p>
            <div>
              <div className="col-12 d-flex justify-content-center" style={{ marginTop: "25px" }}>
                <div
                  className="card align-items-center border-0 justify-content-center"
                  style={{ width: "18rem", marginRight: "20px", padding: "30px", backgroundColor: "white" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "100px", border: "9px solid #01acac", height: "8rem", width: "8rem", backgroundColor: "#01acac" }}
                  >
                    <FontAwesomeIcon icon={faLayerGroup} style={{ width: "3rem", height: "3rem" }} />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Free Registration</h5>
                    <p>Hassle-free registration </p>
                    <p>Guided one-on-one onboarding for landlords</p>
                  </div>
                </div>
                <div
                  className="card align-items-center border-0 justify-content-center"
                  style={{ width: "18rem", marginRight: "20px", padding: "30px", backgroundColor: "white" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "100px", border: "9px solid #01acac", height: "8rem", width: "8rem", backgroundColor: "#01acac" }}
                  >
                    <FontAwesomeIcon icon={faClipboardList} style={{ width: "3rem", height: "3rem" }} />
                  </div>
                  <div className="card-body" style={{ backgroundColor: "white" }}>
                    <h5 className="card-title">No Dead Listings</h5>
                    <p className="card-text">Live updates on property availability </p>
                    <p>No fake adverts</p>
                  </div>
                </div>
                <div
                  className="card align-items-center border-0 justify-content-center"
                  style={{ width: "18rem", marginRight: "20px", padding: "30px", backgroundColor: "white" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "100px", border: "9px solid #01acac", height: "8rem", width: "8rem", backgroundColor: "#01acac" }}
                  >
                    <FontAwesomeIcon icon={faMapLocationDot} style={{ width: "3rem", height: "3rem" }} />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Island-Wide Coverage</h5>
                    <p className="card-text">We list properties available on all our sister islands</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="text-center text-light" style={{ backgroundColor: "#055160", minHeight: mobileView ? "8rem" : "3.5rem", alignItems: "center" }}>
          <p className="py-2">Interested in promoting your business on our website? Contact us on tci.homebase.tc@gmail.com or at +1(649) 348-4021</p>
        </div>
      </div>
      <LandlordProposalButton />
    </div>
  );
};

export default connect()(Home);
