import React from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Listing from "../../database/models/listing";

type Props = {
  show: boolean;
  listing: Listing;
  setShow: (boolean) => void;
};

export const LandlordProfileModal = (props: Props) => {
  return (
    <Modal show={props.show}>
      <Modal.Header>
        <Modal.Title></Modal.Title>
        <Button variant="danger" onClick={() => props.setShow(false)}>
          X
        </Button>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center">
        Body <br />
        {JSON.stringify(props.listing)}
      </Modal.Body>
      <Modal.Footer>Footer</Modal.Footer>
    </Modal>
  );
};

export default connect()(LandlordProfileModal);
