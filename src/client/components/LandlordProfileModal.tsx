import React from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Listing from "../../database/models/listing";
import dayjs from "dayjs";

type Props = {
  show: boolean;
  listing: Listing;
  setShow: (boolean) => void;
};

export const LandlordProfileModal = (props: Props) => {
  const { show, listing, setShow } = props;

  const isPostByAdmin = listing.adminId != null;
  const landlordPostButProfileIncomplete = listing.adminId == null && listing.ListingLandlord == null;
  const showHomeBase = isPostByAdmin || landlordPostButProfileIncomplete;
  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>
          {listing.ListingLandlord?.firstName} {listing.ListingLandlord?.lastName}
        </Modal.Title>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center">
        {showHomeBase && (
          <h6>
            Posted by <span className="fw-bold">TCI HOMEBASE PROPERTY MANAGEMENT</span>
          </h6>
        )}
        {!isPostByAdmin && listing.ListingLandlord && (
          <div>
            <h6 className="fw-bolder">Date Joined</h6>
            <p>{dayjs(listing.ListingLandlord?.createdAt).fromNow()}</p>
            <h6 className="fw-bolder">Home Island</h6>
            <p>{listing.ListingLandlord?.homeIsland}</p>
            <h6 className="fw-bolder">Contact</h6>
            <p>{listing.ListingLandlord?.phoneNumber}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default connect()(LandlordProfileModal);
