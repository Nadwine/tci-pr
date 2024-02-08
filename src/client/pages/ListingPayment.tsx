import axios from "axios";
import React, { useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

const ListingPayment = props => {
  const params = useParams();
  const listingId = params.id;
  const [amountUSD, setAmountUSD] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");

  const submitPayment = async () => {
    if (!amountUSD || !cardHolderName || cardNumber || !expiration || !cvv || !paymentReference) return;

    await axios.post(`/payments/single-payment/${listingId}`, {
      paymentReference: paymentReference,
      amountUSD: Number(amountUSD).toFixed(2),
      cardHolderName: cardHolderName,
      cardNumber: cardNumber,
      expiration: expiration,
      cvv: cvv
    });
  };

  return (
    <div className="listing-payment">
      <div className="d-flex flex-column justify-content-center">
        <h6>Listing payment</h6>
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0" style={{ width: "100%", display: "flex" }}>
                Generate Payment Link
                <i className="bi bi-chevron-down ms-auto" />
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlInput1" className="form-label pe-4">
                    Payment reference
                  </label>
                  <input type="text" className="form-control-sm" value={paymentReference} onChange={e => setPaymentReference(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlInput1" className="form-label pe-3">
                    Charge Amount USD
                  </label>
                  <input type="text" className="form-control-sm" value={amountUSD} onChange={e => setAmountUSD(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlInput1" className="form-label">
                    Card Holder Name
                  </label>
                  <input type="text" className="form-control border-2 border-dark" value={cardHolderName} onChange={e => setCardHolderName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlInput1" className="form-label">
                    Card Number
                  </label>
                  <input type="text" className="form-control border-2" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                </div>
                <div className="mb-3 mt-5">
                  <label htmlFor="exampleFormControlInput1" className="form-label me-2">
                    Expiration
                  </label>
                  <input type="text" className="form-control-sm border-dark" value={expiration} onChange={e => setExpiration(e.target.value)} />

                  <label htmlFor="exampleFormControlInput1" className=" ms-5 form-label me-2">
                    CVV
                  </label>
                  <input type="text" className="form-control-sm border-primary" value={cvv} onChange={e => setCvv(e.target.value)} />
                </div>
                <div className="mt-5">
                  <button onClick={() => submitPayment()} className="btn btn-success">
                    Process Payment
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
