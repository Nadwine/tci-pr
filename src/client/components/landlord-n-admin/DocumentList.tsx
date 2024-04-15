import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import PropertyDocument from "../../../database/models/property_document";
import PropertyForRent from "../../../database/models/property_for_rent";
import { Modal } from "react-bootstrap";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";

type Props = {
  property?: PropertyForRent;
  initialLoad: () => void;
};
const DocumentList = (props: Props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { property, initialLoad } = props;
  const docs = property?.PropertyDocuments;
  const noDocs = docs?.length === 0;

  const UploadDocModal = (props: any) => {
    const [documentType, setDocumentType] = useState("receipt");
    const [attachExpense, setAttachExpense] = useState(false);
    const [operation, setOperation] = useState("minus");
    const [expenseAmount, setExpenseAmount] = useState<number>();
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const formRef = useRef(null);

    const uploadDoc = async e => {
      e.preventDefault();
      const formData = new FormData(formRef.current || undefined);
      const body: any = { propertyForRentId: property?.id, category: "purchase" };
      for (var pair of formData.entries()) {
        body[pair[0]] = pair[1];
      }
      if (!body.file.name) {
        toast.error("please select a file to upload");
        return;
      }

      if (attachExpense) {
        if (!operation || !expenseAmount || !date || !description) {
          toast.error("Attach Expense is selected. Please fill in expense data");
          return;
        }
      }

      const res = await axios.post("/api/property-document/upload", body, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.status === 200) {
        toast.success("Success");
        setShowUploadModal(false);
        initialLoad();
      } else {
        toast.error("Something went wrong uploading this document");
      }
    };

    return (
      <>
        <Modal show={props.show} centered onHide={() => setShowUploadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Document</Modal.Title>
          </Modal.Header>
          <form ref={formRef} onSubmit={uploadDoc} className="d-flex flex-column justify-content-center">
            <Modal.Body>
              <div className="py-2 d-flex align-items-center">
                <label className="pe-5">File</label>
                <div className="col-7">
                  <input className="form-control form-control-sm" name="file" id="formFileSm" type="file" />
                </div>
              </div>
              <div className="py-2 d-flex align-items-center">
                <label className="pe-4">Document Type</label>
                <select name="documentType" onChange={e => setDocumentType(e.target.value)} className="form-select">
                  <option selected={documentType === "receipt"} value="receipt">
                    receipt
                  </option>
                  <option selected={documentType === "inspection"} value="inspection">
                    inspection
                  </option>
                </select>
              </div>
              <div className="py-2 d-flex align-items-center">
                <label className="pe-4">Attach Expense Data</label>
                <input
                  name="attachExpense"
                  value={String(attachExpense)}
                  checked={Boolean(attachExpense)}
                  onChange={e => setAttachExpense(e.target.checked)}
                  className="col-4"
                  type="checkbox"
                />
              </div>
              {attachExpense && (
                <div>
                  <div className="py-2 d-flex align-items-center">
                    <label className="pe-4">Operation</label>
                    <select name="operation" onChange={e => setOperation(e.target.value)} className="form-select">
                      <option selected={operation === "minus"} value="minus">
                        {"- "}Minus
                      </option>
                      <option selected={operation === "add"} value="add">
                        {"+ "}Add
                      </option>
                    </select>
                  </div>
                  <div className="py-2 d-flex align-items-center">
                    <label className="pe-4">Amount</label>
                    <div className="col-4">
                      <input
                        name="expenseAmount"
                        value={expenseAmount}
                        onChange={e => setExpenseAmount(Number(e.target.value))}
                        type="number"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="py-2 d-flex align-items-center">
                    <label className="pe-4">Date Of Transaction</label>
                    <div className="col-4">
                      <input
                        name="date"
                        value={dayjs(date).format("YYYY-MM-DDTHH:MM")}
                        onChange={e => setDate(e.target.value)}
                        type="datetime-local"
                        className="form-control"
                        style={{ width: "13em" }}
                      />
                    </div>
                  </div>
                  <div className="py-2 d-flex align-items-center">
                    <label className="pe-4">Description</label>
                    <div className="col-4">
                      <input
                        name="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        type="text"
                        className="form-control"
                        style={{ width: "14em" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button className="btn text-primary" type="submit">
                  Upload
                </button>
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      </>
    );
  };

  if (noDocs) {
    return (
      <div className="rounded py-2 text-center" style={{ maxWidth: "500px", height: "3em", backgroundColor: "#d4d3d3" }}>
        <div>No Documents to display</div>
        <button onClick={() => setShowUploadModal(true)} className="float-end pe-1 py-4 btn text-primary">
          Upload New <i className="bi bi-upload ps-2" />
        </button>
        <UploadDocModal show={showUploadModal} />
      </div>
    );
  }

  // /api/property-document/upload
  return (
    <div style={{ maxWidth: "500px" }}>
      <UploadDocModal show={showUploadModal} />
      <Accordion style={{ maxWidth: "500px" }}>
        <AccordionSummary expandIcon={<i className="bi bi-chevron-down" />} aria-controls="panel1-content" id="panel1-header">
          <div>{docs?.length} Document</div>
        </AccordionSummary>
        <AccordionDetails>
          {docs?.map((currDoc, i) => {
            const fileName = currDoc.s3BucketKey.split("/")[2];
            var link = document.createElement("a");
            link.href = currDoc.mediaUrl;
            link.download = fileName;
            return (
              <div className="point text-primary" style={{ width: "fit-content" }} key={i} onClick={() => link.click()}>
                {fileName} <i className="bi bi-download ps-2" />
              </div>
            );
          })}
        </AccordionDetails>
      </Accordion>
      <button onClick={() => setShowUploadModal(true)} className="float-end pe-1 py-4 btn text-primary">
        Upload New <i className="bi bi-upload ps-2" />
      </button>
    </div>
  );
};

export default connect()(DocumentList);
