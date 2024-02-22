import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import PropertyDocument from "../../../database/models/property_document";

type Props = {
  documents?: PropertyDocument[];
};
const DocumentList = (props: Props) => {
  const docs = props.documents;
  const noDocs = false; // props.documents?.length === 0;
  return (
    <div>
      {noDocs && (
        <div className="rounded py-2 text-center" style={{ maxWidth: "500px", height: "3em", backgroundColor: "#d4d3d3" }}>
          No Documents to display
        </div>
      )}
      <Accordion style={{ maxWidth: "500px" }}>
        <AccordionSummary expandIcon={<i className="bi bi-chevron-down" />} aria-controls="panel1-content" id="panel1-header">
          <div>{1} Document</div>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            Tenancy Agreement <i className="bi bi-download ps-2" />
          </div>
          <div>
            Inspection 03-04-2024 <i className="bi bi-download ps-2" />
          </div>
          <div>
            Plywood Reciept 04-05-2024 <i className="bi bi-download ps-2" />
          </div>
          <div className="float-end pe-1 py-4 btn-link">
            Upload New <i className="bi bi-upload ps-2" />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default connect()(DocumentList);
