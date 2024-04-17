import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import Listing from "../../database/models/listing";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faPerson } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { RootState, store } from "../redux/store";
import { Navigate, useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel";

const ViewRentProperty = props => {
  const params = useParams();
  const { id } = params;
  const [listing, setListing] = useState<Listing>();
  const [savedListings, setSavedListings] = useState<Listing[]>();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [isEnqJustSent, setIsEnqJustSent] = useState(false);
  const enquiryRef = useRef<HTMLFormElement>(null);
  const user = useSelector((root: RootState) => root.auth.user);
  const isOwner = user?.id === listing?.Admin?.userId || user?.id === listing?.ListingLandlord?.userId;
  const isListingSaved = savedListings?.find(l => l.id === listing?.id);
  const showEnqBtn = !user ? true : !isOwner;
  const navigate = useNavigate();
  const mql = window.matchMedia("(max-width: 600px)");

  let mobileView = mql.matches;

  const initialFetch = async () => {
    const res = await axios.get(`/api/listing/rent/${id}`);
    if (res.status === 200) {
      setListing(res.data);
      setLoading(false);
    } else {
      setLoading(false);
      console.log(`/api/listing/rent/${id}`, res);
    }

    if (user) {
      const savedListResponse = await axios.get("/api/listing/my-saved");
      if (res.status === 200) setSavedListings(savedListResponse.data);
      if (res.status !== 200) toast.error("Unable to detect if this listing was saved");
    }
  };

  const submitEnquiry = async (body: object) => {
    if (!listing) return;
    if (alreadySubmitted) return;

    const res = await axios.post(`/api/enquiry/${listing.id}`, body);
    if (res.status === 200) {
      toast.success("Enquiry Sent", { theme: "colored" });
      setIsEnqJustSent(true);
    } else {
      toast.error("Failed to send enquiry. Try again", { theme: "colored" });
    }
  };

  const handleRedirect = () => {
    const authState = store.getState().auth;
    if (!authState.user) {
      navigate(`/login?returnUrl=${location.pathname}`);
    } else {
      setShowEnquiryModal(true);
      setInterval(() => {
        const myEnquiries = store.getState().message.conversations;
        const alreadySubmitted = myEnquiries.filter(e => e.listingId === listing?.id).length > 0;
        setAlreadySubmitted(alreadySubmitted);
      }, 300);
    }
  };

  const saveListing = async () => {
    const res = await axios.post(`/api/listing/${listing?.id}/save-unsave`);
    if (res.status !== 200) toast.error("Something went wrong saving this listing");
    initialFetch();
  };

  useEffect(() => {
    initialFetch();
  }, []);

  const EnquiryModal = () => {
    return (
      <Modal show={showEnquiryModal} onHide={() => setShowEnquiryModal(false)}>
        <form
          ref={enquiryRef}
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(enquiryRef.current || undefined);
            const body = {};
            for (var pair of formData.entries()) {
              body[pair[0]] = pair[1];
            }
            submitEnquiry(body);
          }}
        >
          <Modal.Header>
            <Modal.Title>Submit enquiry to landlord</Modal.Title>
          </Modal.Header>
          {!alreadySubmitted && (
            <Modal.Body className="d-flex flex-column justify-content-center">
              {!isEnqJustSent &&
                listing?.ListingQuestions &&
                listing.ListingQuestions.map((q, i) => (
                  <div key={i}>
                    <label>{q.text}</label>
                    <input required name={q.text} type="text" className="form-control" />
                  </div>
                ))}
              <h6 className="pt-2">Message</h6>
              <textarea name="message" required className="form-control" />
            </Modal.Body>
          )}
          {alreadySubmitted && (
            <div className="p-5">
              You have already submitted an enquiry for this property. Click
              <button type="button" className="btn text-primary ps-0" onClick={() => navigate(`/enquiries`)}>
                here
              </button>
              to see your enquiry
              <br /> <br />
              Or Select{" "}
              <strong style={{ fontWeight: "bolder" }}>
                {"'"} Enquiries {"'"}
              </strong>{" "}
              from the menu at the top on your profile circle
            </div>
          )}
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={() => setShowEnquiryModal(false)}>
              Cancel
            </Button>
            <Button style={{ backgroundColor: "#087990" }} type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  };

  console.log(listing);
  if (loading) return <LoadingSpinnerWholePage />;
  if (!loading && !listing) return <h3 className="text-muted pt-5 text-center">The Property You Are Looking For No Longer Exists</h3>;
  return (
    <div>
      <EnquiryModal />
      {listing && (
        <div className="card mb-3 shadow-lg mx-md-5">
          <div className="d-flex flex-column text-center w-100 px-5 pt-2">
            <i onClick={() => saveListing()} style={{ color: "#ff617d" }} className={`ms-auto fs-3 bi bi-heart${isListingSaved ? "-fill" : ""} point`} />
            {isListingSaved ? (
              <p className="ms-auto" style={{ fontSize: "12px" }}>
                Saved
              </p>
            ) : (
              <p className="ms-auto" style={{ fontSize: "12px" }}>
                Save
              </p>
            )}
          </div>
          <div className="card-body d-flex flex-wrap justify-content-center">
            <div className="image-container col-10 me-2 pb-3">
              <Carousel images={listing.ListingMedia} />
              <div className="price fw-bolder fs-5" style={{ backgroundColor: "#ebf8ff", borderBottomLeftRadius: "7px", borderBottomRightRadius: "7px" }}>
                {"$"}
                {listing?.PropertyForRent.rentAmount} <span style={{ fontSize: "0.6em" }}>Monthly</span>{" "}
              </div>
            </div>
            <div className="info col-10">
              <div className="title fw-bolder col-12">
                {listing.title}{" "}
                {listing.listingStatus === "in offer" ? (
                  <span className="badge rounded-pill text-dark fw-bold" style={{ backgroundColor: "#ffc008" }}>
                    UNDER OFFER
                  </span>
                ) : (
                  ""
                )}
                <div className="availability col-6 col-md-3 float-end" style={{ fontSize: "15px" }}>
                  <span className="badge rounded-pill" style={{ backgroundColor: "#087990" }}>
                    Available {dayjs(listing?.PropertyForRent.availability).format("MMM, D, YYYY")}
                  </span>
                </div>
              </div>
              <div className="location">{listing.Address.settlement.charAt(0).toUpperCase() + listing.Address.settlement.slice(1)}</div>

              <div className="foot d-flex flex-row">
                <div className="col-7 col-md-9">
                  <div className="rooms pt-5">
                    <FontAwesomeIcon className="pe-1" icon={faBed} />
                    Rooms {listing.PropertyForRent.numOfRooms}
                  </div>
                  <div className="beds pt-2">
                    <FontAwesomeIcon className="pe-1" icon={faBath} />
                    Baths {listing.PropertyForRent.numOfBathRooms}
                  </div>
                  <div className="tenants pt-2">
                    <FontAwesomeIcon className="pe-1" icon={faPerson} />
                    Tenants {listing.PropertyForRent.maxTenant}
                  </div>
                </div>
                <div style={{ fontSize: "15px" }} className="col-5 col-md-3 pt-5 mt-2 me-2 float-end">
                  <div className="fw-bold">Address</div>
                  <div>{listing.Address.addressLine1}</div>
                  <div>{listing.Address.addressLine2}</div>
                  <div>{listing.Address.city}</div>
                </div>
              </div>
              <hr />
              <h5 className="fw-bolder">Description</h5>
              <div style={{ minHeight: "5rem" }} className="description card text-secondary p-2">
                {listing.description}
              </div>
              <div className="bills pt-3">
                <h5 className="fw-bolder">Inclusions</h5>
                <div className="furnished">
                  <span className="pe-2">Furnished:</span>
                  {listing.PropertyForRent.isFurnished ? <i className=" bi-check-circle text-success" /> : <i className=" bi-x-circle-fill text-danger" />}
                </div>
                <div className="internet">
                  <span className="pe-2">Internet:</span>
                  {listing.PropertyForRent.internetIncluded ? <i className=" bi-check-circle text-success" /> : <i className=" bi-x-circle-fill text-danger" />}
                </div>
                <div className="water">
                  <span className="pe-2">Water:</span>
                  {listing.PropertyForRent.waterIncluded ? <i className=" bi-check-circle text-success" /> : <i className=" bi-x-circle-fill text-danger" />}
                </div>
                <div className="electricity">
                  <span className="pe-2">Electricity:</span>
                  {listing.PropertyForRent.electricityIncluded ? (
                    <i className=" bi-check-circle text-success" />
                  ) : (
                    <i className=" bi-x-circle-fill text-danger" />
                  )}
                </div>
              </div>
              <div className="sqft"></div>
              {/* TODO grey out after 1 submission and search data to know if to disable on view 
                    or show a "view your submitted enquiry" button instead
              */}
              {showEnqBtn && listing.listingStatus !== "gone" && (
                <>
                  <hr />
                  <div className="text">
                    <h5 className="fw-bolder">Contact</h5>
                    {/* <div>Email: {listing.Admin.User?.email}</div>
                  <div>Phone: {listing.Admin.phone || "N/A"}</div> */}
                  </div>
                  <div className="mt-4 pb-5">
                    <button onClick={() => handleRedirect()} className="btn btn-success">
                      Submit online enquiry
                    </button>
                  </div>
                </>
              )}
              {listing.listingStatus === "gone" && (
                <h6 className="text-danger py-3 text-center">
                  Sorry Enquiries are no longer being accepted. <br />
                  This Property already been secured.
                </h6>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect()(ViewRentProperty);
