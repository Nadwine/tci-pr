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
import { RootState } from "../redux/store";

const ViewRentProperty = props => {
  const params = useParams();
  const { id } = params;
  const [listing, setListing] = useState<Listing>();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const enquiryRef = useRef<HTMLFormElement>(null);
  const user = useSelector((root: RootState) => root.auth.user);
  const isOwner = user?.id === listing?.Landlord.userId;

  const initialFetch = async () => {
    const res = await axios.get(`/api/listing/rent/${id}`);
    if (res.status === 200) {
      setListing(res.data);
      setLoading(false);
    } else {
      console.log(`/api/listing/rent/${id}`, res);
    }
  };

  const submitEnquiry = async (body: object) => {
    if (!listing) return;

    const res = await axios.post(`/api/enquiry/${listing.id}`, body);
    if (res.status === 200) {
      setShowEnquiryModal(false);
      toast.success("Enquiry Sent", { theme: "colored" });
    } else {
      toast.error("Failed to send enquiry. Try again", { theme: "colored" });
    }
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
          <Modal.Body className="d-flex flex-column justify-content-center">
            {listing?.ListingQuestions &&
              listing.ListingQuestions.map((q, i) => (
                <div key={i}>
                  <label>{q.text}</label>
                  <input required name={q.text} type="text" className="form-control" />
                </div>
              ))}
            <h6 className="pt-5">Message</h6>
            <textarea name="message" required className="form-control" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEnquiryModal(false)}>
              Cancel
            </Button>
            <Button variant="info" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  };

  console.log(listing);
  if (loading) return <LoadingSpinnerWholePage />;
  return (
    <div>
      <EnquiryModal />
      {listing && (
        <div className="card mb-3">
          <div className="card-body d-flex flex-wrap justify-content-center">
            <div className="image-container col-10 me-2 pb-3">
              <img width="100%" src={listing.ListingMedia[0]?.mediaUrl} />
              <div className="price fw-bold fs-5" style={{ backgroundColor: "#ebf8ff", borderBottomLeftRadius: "7px", borderBottomRightRadius: "7px" }}>
                {"$"}
                {listing?.PropertyForRent.rentAmount} <span style={{ fontSize: "0.6em" }}>Monthly</span>{" "}
              </div>
            </div>
            <div className="info col-10">
              <div className="title fw-bold col-12">
                {listing.title}
                <div className="availability col-3 float-end" style={{ fontSize: "0.7em" }}>
                  Available {dayjs(listing?.PropertyForRent.availability).format("MMM, D, YYYY")}
                </div>
              </div>
              <div className="location">{listing.Address.settlement.charAt(0).toUpperCase() + listing.Address.settlement.slice(1)}</div>

              <div className="foot d-flex flex-row">
                <div className="col-9">
                  <div className="rooms pt-5">
                    <FontAwesomeIcon className="pe-1" icon={faBed} />
                    Rooms {listing.PropertyForRent.numOfRooms}
                  </div>
                  <div className="beds pt-2">
                    <FontAwesomeIcon className="pe-1" icon={faBath} />
                    Baths {listing.PropertyForRent.numOfRooms}
                  </div>
                  <div className="tenants pt-2">
                    <FontAwesomeIcon className="pe-1" icon={faPerson} />
                    Tenants {listing.PropertyForRent.maxTenant}
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem" }} className="col-3 pt-5 mt-2 float-end">
                  <div className="fw-bold">Address</div>
                  <div>{listing.Address.addressLine1}</div>
                  <div>{listing.Address.addressLine2}</div>
                  <div>{listing.Address.city}</div>
                </div>
              </div>
              <hr />
              <h5 className="text-secondary">Description</h5>
              <div style={{ minHeight: "5rem" }} className="description card text-secondary p-2">
                {listing.description}
              </div>
              <div className="bills text-secondary pt-3">
                <h6>Inclusions</h6>
                <div className="furnished">
                  <span className="pe-2">Furnished:</span>
                  {listing.PropertyForRent.isFurnished ? <i className=" bi-check-circle" /> : <i className=" bi-x-circle-fill" />}
                </div>
                <div className="internet">
                  <span className="pe-2">Internet:</span>
                  {listing.PropertyForRent.internetIncluded ? <i className=" bi-check-circle" /> : <i className=" bi-x-circle-fill" />}
                </div>
                <div className="water">
                  <span className="pe-2">Water:</span>
                  {listing.PropertyForRent.waterIncluded ? <i className=" bi-check-circle" /> : <i className=" bi-x-circle-fill" />}
                </div>
                <div className="electricity">
                  <span className="pe-2">Electricity:</span>
                  {listing.PropertyForRent.electricityIncluded ? <i className=" bi-check-circle" /> : <i className=" bi-x-circle-fill" />}
                </div>
              </div>
              <div className="sqft"></div>
              {/* TODO grey out after 1 submission and search data to know if to disable on view 
                    or show a "view your submitted enquiry" button instead
              */}
              {!isOwner && (
                <>
                  <hr />
                  <div className="text-secondary">
                    <h6>Contact</h6>
                    {/* <div>Email: {listing.Landlord.User?.email}</div>
                  <div>Phone: {listing.Landlord.phone || "N/A"}</div> */}
                  </div>
                  <div className="mt-4">
                    <button onClick={() => setShowEnquiryModal(true)} className="btn btn-success">
                      Submit online enquiry
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect()(ViewRentProperty);
