import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Listing from "../../database/models/listing";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

const AdminViewListings = props => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [idToDelete, setIdToDelete] = useState<number>();

  const loadData = async () => {
    const res = await axios.get("/api/listing/listings");
    if (res.status !== 200) {
      console.error("error fetching /api/listing/listings");
      return;
    }
    setListings(res.data);
  };

  const goToEditPage = (id: number) => {
    navigate(`/edit-listing/rent/${id}`);
  };

  const goToPaymentsPage = (id: number) => {
    navigate(`/property/rent/${id}/payments`);
  };

  const deleteListing = async () => {
    const res = await axios.delete(`/api/listing/rent/${idToDelete}`);
    if (res.status === 200) {
      toast.success("success");
      loadData();
    } else {
      toast.error("Error deleting. Try again");
    }

    setIdToDelete(undefined);
  };

  useEffect(() => {
    loadData();
  }, []);

  const DeleteConfirmModal = () => (
    <Modal show={idToDelete !== undefined} onHide={() => setIdToDelete(undefined)}>
      <Modal.Header>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this listing?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setIdToDelete(undefined)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => deleteListing()}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="px-lg-5 px-md-5">
      <h3 className="ps-md-5 ms-md-3 mt-5 fw-bolder">Listings</h3>
      <input
        className="form-control mx-md-5 m-3 shadow-sm"
        type="text"
        placeholder="Search..."
        aria-label="default input example"
        style={{ width: "25%", borderRadius: "15px" }}
      ></input>
      {idToDelete && <DeleteConfirmModal />}
      {listings.length === 0 && <h6 className="text-center pt-5">No Listings found</h6>}
      <ul className="list-group shadow-lg mx-lg-5" style={{ borderRadius: "15px" }}>
        {listings.map((l, i) => (
          <li key={i} className="list-group-item d-flex flex-row px-md-3">
            <div className="d-flex flex-column ps-md-3">
              <div className="fw-bold">
                <a href={`/property/rent/${l.id}`} className="link-dark" style={{ position: "relative" }}>
                  {l.title}
                </a>
              </div>
              {l.PropertyForRent && <div>Rent: ${l.PropertyForRent?.rentAmount}</div>}
              {l.PropertyForSale && <div>Sale: ${l.PropertyForSale?.saleAmount}</div>}
              <div>Location: {l.Address.settlement}</div>
              <div>Enquiries: {l.EnquiryConversations?.length}</div>
            </div>
            <div className="d-flex actions ms-auto">
              <button onClick={() => goToPaymentsPage(l.id)} className="btn btn-white">
                <i className="bi bi-cash-coin" />
              </button>
              <button onClick={() => goToEditPage(l.id)} className="btn btn-white">
                <i className="bi bi-pencil" />
              </button>
              <button onClick={() => setIdToDelete(l.id)} className="btn btn-white">
                <i className="bi bi-trash3" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default connect()(AdminViewListings);
