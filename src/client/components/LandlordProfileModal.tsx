import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Listing from "../../database/models/listing";
import dayjs from "dayjs";
import Offcanvas from "react-bootstrap/Offcanvas";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Props = {
  show: boolean;
  listing: Listing;
  setShow: (boolean) => void;
  profileElement: React.ReactElement;
};

export const LandlordProfileModal = (props: Props) => {
  const { show, listing, setShow, profileElement } = props;
  const [landlordProperties, setLandlordProperties] = useState<Listing[]>([]);
  const navigate = useNavigate();

  const isManagedByAdmin = listing.listingManager === "admin";
  const landlordPostButProfileIncomplete = listing.adminId == null && listing.ListingLandlord == null;
  const showHomeBase = isManagedByAdmin || landlordPostButProfileIncomplete;

  const getProperties = async () => {
    const res = await axios.get(`/api/listing/landlord/profile-properties/${listing.ListingLandlord?.userId || listing.Admin?.userId}`);
    setLandlordProperties(res.data);
  };

  useEffect(() => {
    getProperties();
  }, []);

  return (
    <>
      {" "}
      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <p className="text-secondary" style={{ fontSize: "15px" }}>
              Owner Details
            </p>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {showHomeBase && (
            <div>
              <h6>
                Posted by <span className="fw-bold">TCI HOMEBASE PROPERTY MANAGEMENT</span>
              </h6>
              <div className="d-flex justify-content-center">{profileElement}</div>
              <p className="pt-3">Add brief info about company here</p>
            </div>
          )}
          {!isManagedByAdmin && listing.ListingLandlord && (
            <div>
              <div className="d-flex flex-column align-items-center">
                <h5 className="mb-3 justify-content-center" style={{ fontWeight: "700px" }}>
                  {listing.ListingLandlord?.firstName} {listing.ListingLandlord.lastName}
                </h5>
                {profileElement}
              </div>
              <hr className="mt-5" />
              <h6 style={{ fontWeight: "700px" }}>Date Joined</h6>
              <p className="text-secondary">{dayjs(listing.ListingLandlord?.createdAt).fromNow()}</p>
              <h6 style={{ fontWeight: "700px" }}>Home Island</h6>
              <p className="text-secondary">{listing.ListingLandlord?.homeIsland}</p>
              {/* <h6 style={{ fontWeight: "700px" }}>Contact</h6>
              <p className="text-secondary">{listing.ListingLandlord?.phoneNumber}</p> */}
              <hr />
              <h6 style={{ fontWeight: "700px" }}>Properties</h6>
              {landlordProperties.map((l, i) => (
                <div key={i}>
                  <button className="btn text-primary point ps-0" onClick={() => navigate(`/property/rent/${listing.id}`)}>
                    {l.title}, {l.Address.settlement}
                  </button>
                </div>
              ))}
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default connect()(LandlordProfileModal);
