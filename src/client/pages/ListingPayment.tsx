import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Listing from "../../database/models/listing";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import StripeConfirmPayment from "../components/StripeConfirmPayment";
import { RootState } from "../redux/store";
import ListingLandlord from "../../database/models/listing_landlord";
import User from "../../database/models/user";

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
  const [landlordUser, setLandlordUser] = useState<User>();
  const [listingLandLord, setListingLandlord] = useState<ListingLandlord>();
  const [clientSecret, setClientSecret] = useState("");
  const [setupIntentId, setSetupIntentId] = useState("");
  const [loading, setLoading] = useState(true);
  const loginUsr = useSelector((r: RootState) => r.auth.user);
  const landlordFormRef = useRef<HTMLFormElement>(null);
  const stripePromise = loadStripe("pk_test_51OYZbBIGvo7mWPbtUd3Dvc2lKOTPTdp2Ic8uD7uVcxbMbFERYYCu5ulgjJZ7EcPkQxSqp0rYi0AagRNAZ43sRJ7P00Zj8d0CEX");

  const isLanlord = loginUsr?.accountType === "landlord";
  const landlordId = isLanlord ? loginUsr.id : listing?.ListingLandlord?.userId;

  const initialFetch = async () => {
    const listingRes = await axios.get(`/api/listing/rent/expanded/${listingId}`);
    const landlordRes = await axios.get(`/api/landlord/${landlordId}`);
    if (landlordRes?.status === 200) setLandlordUser(landlordRes.data);
    console.log("landlord", landlordRes.data);
    if (listingRes.status === 200) {
      console.log("/api/listing/rent/expanded", listingRes.data);
      setListing(listingRes.data);
      setLoading(false);
    } else {
      console.log(`/api/listing/rent/${listingId}`, listingRes);
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
        listingId: listing?.id,
        landlordUserId: landlordId
      });
      if (res.status === 200) toast.success("Payment link successfully generated");
    } catch {
      toast.error("Error while generating this link");
    }
    initialFetch();
  };

  const payoutlandlord = async () => {
    // /api/payment/pay-out-landlord
    // const propertyForRentId = req.body.propertyForRentId;
    // const landlordId = req.body.landlordId;
    const reqBody = { propertyForRentId: listing?.PropertyForRent.id, landlordId: listing?.ListingLandlord!.id };
    const res = await axios.post("/api/payment/pay-out-landlord", reqBody);
    if (res.status === 200) toast.success("Payment Sent");
    if (res.status !== 200) toast.error("Error ocured while sending payment. No fund were transfered");
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
    body.browserPath = window.location.pathname;
    const res = await axios.post("/api/payment/rent/attach-landlord", body);
    if (res.status === 200) {
      setClientSecret(res.data.clientSecret);
      setSetupIntentId(res.data.intentId);
      setListingLandlord(res.data.landlord);
    } else {
      toast.error(res.data.message);
    }
    console.log(res.data.err);
    // submitEnquiry(body);
  };

  const now = dayjs();
  const linkGeneratedAt = listing?.stripePaymentLink?.generatedAt;
  const islinkExpired = dayjs(linkGeneratedAt).add(23, "hours").isBefore(now);

  const disableForm = loginUsr?.accountType === "landlord";

  return (
    <div className="listing-payment">
      <div className="d-flex flex-column justify-content-center mx-1 mx-md-5">
        <h3 className="my-5">Listing Payment</h3>
        <Accordion defaultActiveKey={"0"}>
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
                <button disabled={linkGeneratedAt ? !islinkExpired : false} onClick={() => submitPaymentLinkCreation()} className="btn bg-primary">
                  Generate New Link
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          {/* <Accordion.Item eventKey="1">
            <Accordion.Header>LandLord Details</Accordion.Header>
            <Accordion.Body>
              <h4>Landlord to Pay</h4>
              <form ref={landlordFormRef} onSubmit={submitNewLandLord}>
                <div className="mb-3 w-50">
                  <label>First Name</label>
                  <input name="firstName" className="form-control" defaultValue={landlordUser?.ListingLandlord?.firstName} required />
                </div>
                <div className="mb-3 w-50">
                  <label>Last Name</label>
                  <input name="lastName" className="form-control" defaultValue={landlordUser?.ListingLandlord?.lastName} required />
                </div>
                <div className="mb-3 w-50">
                  <label>Email</label>
                  <input name="landlordEmail" className="form-control" defaultValue={landlordUser?.email} required />
                </div>
                <div className="mb-3 w-50">
                  <label>Phone</label>
                  <input name="phoneNumber" className="form-control" defaultValue={landlordUser?.ListingLandlord?.phoneNumber} required />
                </div>
                <div className="mb-3 w-50">
                  <label>Home Island</label>
                  <input name="homeIsland" className="form-control" defaultValue={landlordUser?.ListingLandlord?.homeIsland} required />
                </div>
                <div className="mb-3 w-50">
                  <label>Address</label>
                  <input name="address" className="form-control" defaultValue={landlordUser?.ListingLandlord?.addressString} required />
                </div>
                <button className="btn bg-primary">+ Add Credit Card</button>
              </form>
              <div className="text-danger pt-3">TODO Show card alrady linked and make remove card button</div>
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeConfirmPayment clientSecret={clientSecret} landlord={listingLandLord} />
                </Elements>
              )}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Pay Landlord</Accordion.Header>
            <Accordion.Body>
              <button className="btn bg-primary" onClick={() => payoutlandlord()}>
                Pay
              </button>
            </Accordion.Body>
          </Accordion.Item> */}
        </Accordion>
      </div>
    </div>
  );
};

export default connect()(ListingPayment);
