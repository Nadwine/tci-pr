import axios from "axios";
import React, { useEffect, useState } from "react";
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

  const initialFetch = async () => {
    const res = await axios.get(`/api/listing/rent/${listingId}`);
    if (res.status === 200) {
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

  const now = dayjs();
  const linkGeneratedAt = listing?.stripePaymentLink?.generatedAt;
  const islinkExpired = dayjs(linkGeneratedAt).add(23, "hours").isBefore(now);

  return (
    <div className="listing-payment">
      <div className="d-flex flex-column justify-content-center">
        <h6>Listing payment</h6>
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0" style={{ width: "100%", display: "flex" }}>
                Payment Link
                <i className="bi bi-chevron-down ms-auto" />
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
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
                <div className="mt-5">
                  <button disabled={linkGeneratedAt ? !islinkExpired : false} onClick={() => submitPaymentLinkCreation()} className="btn btn-success">
                    Generate New Link
                  </button>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1" style={{ width: "100%", display: "flex" }}>
                Details
                <i className="bi bi-chevron-down ms-auto" />
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>No data</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </div>
  );
};

export default connect()(ListingPayment);
