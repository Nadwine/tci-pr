import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Listing from "../../database/models/listing";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const ListingPayment = props => {
  const params = useParams();
  const listingId = params.id;
  const [amountUSD, setAmountUSD] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [listing, setListing] = useState<Listing>();
  const [loading, setLoading] = useState(true);
  const landlordFormRef = useRef<HTMLFormElement>(null);

  const initialFetch = async () => {
    const res = await axios.get(`/api/listing/rent/expanded/${listingId}`);
    if (res.status === 200) {
      console.log("/api/listing/rent/expanded", res.data);
      setListing(res.data);
      setLoading(false);
    } else {
      console.log(`/api/listing/rent/${listingId}`, res);
    }
  };

  useEffect(() => {
    initialFetch();
  }, []);

  const submitPaymentLinkCreation = async () => {
    if (!listing) return;

    try {
      const res = await axios.post("/api/payment/rent/create/monthly-payment-link", {
        amountUSD: listing?.PropertyForRent.rentAmount,
        listingId: listing?.id
      });
      if (res.status === 200) toast.success("Payment link successfully generated");
    } catch {
      toast.error("Error while generating this link");
    }
    initialFetch();
  };

  const submitNewLandLord = async e => {
    //payment/rent/attach-landlord
    // const { landlordEmail, firstName, lastName, phoneNumber, homeIsland, address, cardDetails, listingId } = req.body;
    // const { cardNumber, expMonth, expYear, cvv, account_holder_name } = req.body;
    e.preventDefault();
    const formData = new FormData(landlordFormRef.current || undefined);
    const body: any = {};
    for (var pair of formData.entries()) {
      body[pair[0]] = pair[1];
    }
    body.listingId = listing?.id;
    const res = await axios.post("/api/payment/rent/attach-landlord", body);
    toast.error(JSON.stringify(res.data.err));
    console.log(res.data.err);
    // submitEnquiry(body);
  };

  const now = dayjs();
  const linkGeneratedAt = listing?.stripePaymentLink?.generatedAt;
  const islinkExpired = dayjs(linkGeneratedAt).add(23, "hours").isBefore(now);

  return (
    <div className="listing-payment">
      <div className="d-flex flex-column justify-content-center mx-5">
        <h3 className="m-5">Listing Payment</h3>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Tenant Payment Link</Accordion.Header>
            <Accordion.Body>
              <h6 className="pb-3">Reoccurring Payment</h6>
              <div>
                <div>
                  Amount ${listing?.PropertyForRent.rentAmount}
                  <br />
                  Interval: Monthly
                </div>
              </div>
              {listing?.stripePaymentLink && (
                <div className="pt-5">
                  Generated At: {dayjs(linkGeneratedAt).format("MMMM DD YYYY HH:MM:ss a")}
                  <br />
                  Link Status: {islinkExpired ? "Expired" : "Active"}
                  <code className="card">
                    <a href={listing.stripePaymentLink.url}>{listing.stripePaymentLink.url}</a>
                  </code>
                </div>
              )}
              <div className="mt-5">{linkGeneratedAt && "Please send this link to the respected tenant"}</div>
              <div className="mt-2">
                <button disabled={linkGeneratedAt ? !islinkExpired : false} onClick={() => submitPaymentLinkCreation()} className="btn btn-success">
                  Generate New Link
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>LandLord Details</Accordion.Header>
            <Accordion.Body>
              <h4>Create Landlord to Pay</h4>
              <form ref={landlordFormRef} onSubmit={submitNewLandLord}>
                <div className="mb-3 w-50">
                  <label>First Name</label>
                  <input name="firstName" className="form-control" defaultValue="Brutchsama" />
                </div>
                <div className="mb-3 w-50">
                  <label>Last Name</label>
                  <input name="lastName" className="form-control" defaultValue="Jean-Louis" />
                </div>
                <div className="mb-3 w-50">
                  <label>Email</label>
                  <input name="landlordEmail" className="form-control" defaultValue="brutchsama@mail.com" />
                </div>
                <div className="mb-3 w-50">
                  <label>Phone</label>
                  <input name="phoneNumber" className="form-control" defaultValue="+447535799721" />
                </div>
                <div className="mb-3 w-50">
                  <label>Home Island</label>
                  <input name="homeIsland" className="form-control" defaultValue="Providenciales" />
                </div>
                <div className="mb-3 w-50">
                  <label>Address</label>
                  <input name="address" className="form-control" defaultValue="Address, Test street, Five Cays" />
                </div>
                <div className="mb-3 w-50">
                  <label>Card Number 4242424242424242</label>
                  <input name="cardNumber" className="form-control" defaultValue="4242424242424242" />
                </div>
                <div className="mb-3 w-50">
                  <label>Expiry Month</label>
                  <input name="expMonth" className="form-control" defaultValue="12" />
                </div>
                <div className="mb-3 w-50">
                  <label>Expiry Year</label>
                  <input name="expYear" className="form-control" defaultValue="2027" />
                </div>
                <div className="mb-3 w-50">
                  <label>Cvv</label>
                  <input name="cvv" className="form-control" defaultValue="123" />
                </div>
                <div className="mb-3 w-50">
                  <label>Name On Card</label>
                  <input name="nameOnCard" className="form-control" defaultValue="Brutchsama" />
                </div>
                <button className="btn btn-primary">Submit</button>
              </form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

export default connect()(ListingPayment);
