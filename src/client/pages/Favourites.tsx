import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Listing from "../../database/models/listing";
import { faBed, faBath } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { connect } from "react-redux";

const Favourites = () => {
  const navigate = useNavigate();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);

  const viewProperty = (id: number) => {
    const listingToView = savedListings.find(l => l.id === id);

    if (listingToView?.listingStatus === "gone") return;
    navigate(`/property/rent/${id}`);
  };

  const displayEmptyMsg = savedListings?.length === 0 || !savedListings;

  const fetchInitialSearchResult = async () => {
    const res = await axios.get(`/api/listing/my-saved`);
    if (res.status === 200) {
      setSavedListings(res.data);
    }
    if (res.status !== 200) toast.error("Internal Server Error");
  };

  useEffect(() => {
    fetchInitialSearchResult();
  }, []);

  return (
    <div>
      <h3 className="m-4 m-md-5 pt-3 pt-md-0">
        Your Saved Properties <i className="bi bi-heart px-1" style={{ color: "pink" }}></i>
      </h3>
      <div style={{ minHeight: "70vh" }} className="list col-12 col-md-8 mx-auto col-lg-8 col-xl-8">
        {savedListings &&
          savedListings.map((listing, i) => (
            <div key={i} className="card mb-3 shadow-sm">
              <div className="card-body d-flex flex-wrap">
                <div onClick={() => viewProperty(listing.id)} className="image-container point col-12 col-md-5 me-2 pb-3">
                  {listing.ListingMedia[0].mediaType === "image" && (
                    <img width="100%" src={listing.ListingMedia.find(m => m.mediaType === "image")?.mediaUrl} />
                  )}
                  <div className="price fw-bold fs-5" style={{ backgroundColor: "#ebf8ff", borderBottomLeftRadius: "7px", borderBottomRightRadius: "7px" }}>
                    {"$"}
                    {listing?.PropertyForRent.rentAmount} <span style={{ fontSize: "0.6em" }}>Monthly</span>{" "}
                  </div>
                </div>
                <div className="info col-12 col-md-6 overflow-hidden">
                  <div onClick={() => viewProperty(listing.id)} className="title fw-bold col-10 point">
                    {listing.title}
                    {/* <div className="availability col-3 float-end" style={{ fontSize: "0.7em" }}>
                    Available {dayjs(listing?.PropertyForRent.availability).format("MMM, D, YYYY")}
                  </div> */}
                  </div>
                  <div onClick={() => viewProperty(listing.id)} className="location pt-2 point">
                    {listing.Address.settlement.charAt(0).toUpperCase() + listing.Address.settlement.slice(1)}
                  </div>

                  <div className="foot d-flex flex-row pt-2">
                    <div onClick={() => viewProperty(listing.id)} className="col-10 point">
                      <div className="beds pt-1">
                        <span className="badge rounded-pill" style={{ backgroundColor: "#087990" }}>
                          Available {dayjs(listing?.PropertyForRent.availability).format("MMM, D, YYYY")}
                        </span>
                      </div>
                      <div className="beds pt-2">
                        <FontAwesomeIcon className="pe-1" icon={faBed} />
                        Rooms {listing.PropertyForRent.numOfRooms}
                      </div>
                      <div className="beds pt-2">
                        <FontAwesomeIcon className="pe-1" icon={faBath} />
                        Baths {listing.PropertyForRent.numOfBathRooms}
                      </div>
                      <div className="beds pt-3 col-12 col-md-12" style={{ overflow: "hidden", textOverflow: "ellipsis", height: "5.5em" }}>
                        {listing.description}..
                      </div>
                      <div className="beds pt-3" style={{ color: "#087990" }}>
                        {" "}
                        Added {dayjs(listing.createdAt).fromNow()}
                      </div>
                    </div>
                    {/* <div className="col-2 pt-5 mt-2 float-end">
                      <p className="fw-bold" style={{ color: "#087990", fontSize: "12px" }}>
                        Posted by
                      </p>
                      <span
                        onClick={() => {
                          // setViewListingProfile(listing);
                          // setShowProfileModal(true);
                        }}
                        className="btn btn-link bg-white border-info rounded-circle text-black fs-5"
                        style={{ width: "45px", height: "45px", marginLeft: "7px" }}
                      >
                        {listing?.Admin?.User?.email?.charAt(0) || listing?.ListingLandlord?.firstName?.charAt(0)}
                      </span>
                    </div> */}
                  </div>
                  <div onClick={() => viewProperty(listing.id)} className="filler point" style={{ width: "100%", height: "40%" }} />
                </div>
              </div>
            </div>
          ))}
        {displayEmptyMsg && (
          <div className="d-flex w-100 flex-column" style={{ justifyContent: "center" }}>
            {" "}
            <div className="text-center" style={{ justifyContent: "center" }}>
              You have no saved properties at the moment. To save a property, try clicking the <i className="bi bi-heart px-1"></i> symbol on the top right
              corner of a listing.
            </div>
            <div className="d-flex w-100 text-center" style={{ justifyContent: "center" }}>
              <img src="/static/no-message.png"></img>
            </div>{" "}
          </div>
        )}
      </div>
    </div>
  );
};
export default connect()(Favourites);
