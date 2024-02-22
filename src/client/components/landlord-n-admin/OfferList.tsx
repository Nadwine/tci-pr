import React from "react";
import { connect } from "react-redux";
import Offer from "../../../database/models/offer";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

type Props = {
  offers?: Offer[];
  onClickViewEnquiry: (number) => void;
};
const OfferList = (props: Props) => {
  const { offers, onClickViewEnquiry } = props;
  const noOffers = offers?.length === 0;
  return (
    <div className="offer-list">
      {noOffers && (
        <div className="rounded py-2 text-center" style={{ maxWidth: "500px", height: "3em", backgroundColor: "#d4d3d3" }}>
          No Offers to display
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
                <div className="ms-auto">
                  <button className="btn text-danger">Decline</button>
                  <button className="btn text-success">Accept</button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default connect()(OfferList);
