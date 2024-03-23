import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Listing from "../../database/models/listing";
import dayjs from "dayjs";
import Offcanvas from "react-bootstrap/Offcanvas";
import axios from "axios";

type Props = {
  show: boolean;
  listing: Listing;
  setShow: (boolean) => void;
};

export const LandlordProfileModal = (props: Props) => {
  const { show, listing, setShow } = props;
  const [landlordProperties, setLandlordProperties] = useState<Listing[]>([]);

  const isPostByAdmin = listing.adminId != null;
  const landlordPostButProfileIncomplete = listing.adminId == null && listing.ListingLandlord == null;
  const showHomeBase = isPostByAdmin || landlordPostButProfileIncomplete;

  const getProperties = async () => {
    const res = await axios.get(`/api/listing/landlord/profile-properties/${listing.ListingLandlord?.userId}`);
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
          <Offcanvas.Title>Owner Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {showHomeBase && (
            <div>
              <h6>
                Posted by <span className="fw-bold">TCI HOMEBASE PROPERTY MANAGEMENT</span>
              </h6>
              <p className="pt-3">Find out more about TCI Homebase on here-make link</p>
            </div>
          )}
          {!isPostByAdmin && listing.ListingLandlord && (
            <div>
              <h5 className="mb-3" style={{ fontWeight: "700px" }}>
                {listing.ListingLandlord?.firstName} {listing.ListingLandlord.lastName}
              </h5>
              <hr />
              <h6 style={{ fontWeight: "700px" }}>Date Joined</h6>
              <p className="text-secondary">{dayjs(listing.ListingLandlord?.createdAt).fromNow()}</p>
              <h6 style={{ fontWeight: "700px" }}>Home Island</h6>
              <p className="text-secondary">{listing.ListingLandlord?.homeIsland}</p>
              <h6 style={{ fontWeight: "700px" }}>Contact</h6>
              <p className="text-secondary">{listing.ListingLandlord?.phoneNumber}</p>

              <h6 style={{ fontWeight: "700px" }}>Properties</h6>
              {landlordProperties.map((l, i) => (
                <div key={i}>
                  {l.title}, {l.Address.settlement}
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
