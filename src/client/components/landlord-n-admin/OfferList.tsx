import React, { useState } from "react";
import { connect } from "react-redux";
import Offer from "../../../database/models/offer";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Button, Modal } from "react-bootstrap";
dayjs.extend(duration);

type Props = {
  offers?: Offer[];
  onClickViewEnquiry: (userId: number) => void;
  onSubmitOffer: (offerId: number, status: string) => void;
  isOffersEnabled: boolean;
};
const OfferList = (props: Props) => {
  const { offers, isOffersEnabled, onClickViewEnquiry, onSubmitOffer } = props;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [offerAction, setOfferAction] = useState({ offerId: 0, status: "" });
  const noOffers = offers?.length === 0;

  const showOfferActionButtons = true; //offers?.filter(o => o.status === "accepted").length === 0;
  return (
    <div className="offer-list">
      {noOffers && (
        <div className="rounded py-2 text-center" style={{ maxWidth: "500px", minHeight: "3em", backgroundColor: "#d4d3d3" }}>
          {isOffersEnabled && "No Offers to display"}
          {!isOffersEnabled && "Your current subscription does not include viewing and accepting offers from tenants"}
        </div>
      )}
      {offers?.map((currOffer, currIndex) => {
        const amount = currOffer.amount;
        const preferredStartDate = currOffer.preferredStartDate;
        const tenancyLengthDays = currOffer.tenancyLengthDays;
        const monthLength = parseInt(
          Number(tenancyLengthDays / 30)
            .toString()
            .split(".")[0]
        );
        const remainingDays = tenancyLengthDays - monthLength * 30;
        const user = currOffer.User;

        if (currOffer.status === "declined") {
          return (
            <Accordion key={currIndex} style={{ maxWidth: "500px" }}>
              <AccordionSummary
                style={{ textDecoration: "line-through" }}
                key={currIndex}
                expandIcon={<i className="bi bi-chevron-down" />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div>${amount}</div>
                <div className="ms-auto px-2">Starting {dayjs(preferredStartDate).format("MMM, D, YYYY")}</div>
              </AccordionSummary>
              <AccordionDetails className="text-danger">Offer Declined</AccordionDetails>
            </Accordion>
          );
        }

        return (
          <Accordion key={currIndex} style={{ maxWidth: "500px" }}>
            <AccordionSummary expandIcon={<i className="bi bi-chevron-down" />} aria-controls="panel1-content" id="panel1-header">
              <div>${amount}</div>
              <div className="ms-auto px-2">Starting {dayjs(preferredStartDate).format("MMM, D, YYYY")}</div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="pb-4">
                <div className="full-name fw-bold d-flex">
                  {user.Profile?.firstName} {user.Profile?.lastName}
                  <a className="link point ms-auto" onClick={() => onClickViewEnquiry(user.id)}>
                    View Enquiry
                  </a>
                </div>
              </div>
              <div>
                <div className="duration">
                  Tenancy Duration: {monthLength} Months {remainingDays} Days
                </div>
              </div>
              <div className="pt-4 d-flex">
                {showOfferActionButtons && currOffer.status !== "accepted" && (
                  <div className="ms-auto">
                    <button
                      onClick={() => {
                        setOfferAction({ offerId: currOffer.id, status: "declined" });
                        setShowConfirmationModal(true);
                      }}
                      className="btn text-danger"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        setOfferAction({ offerId: currOffer.id, status: "accepted" });
                        setShowConfirmationModal(true);
                      }}
                      className="btn text-success"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {offerAction.status === "accepted" ? "accept" : "decline"} this offer?
          <div className="pt-3">
            {offerAction.status === "accepted" &&
              `Accepting this offer will begin initiating the tenancy for ${offers?.find(f => f.id === offerAction.offerId)?.User.Profile?.firstName}`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#107a84" }}
            onClick={() => {
              onSubmitOffer(offerAction.offerId, offerAction.status);
              setShowConfirmationModal(false);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default connect()(OfferList);
