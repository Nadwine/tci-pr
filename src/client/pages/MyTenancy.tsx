import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import Tenancy from "../../database/models/tenancy";
import dayjs from "dayjs";
import axios from "axios";
import { CloseButton, Modal } from "react-bootstrap";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import SignaturePad from "signature_pad";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const MyTenancy = props => {
  const loginUsr = useSelector((r: RootState) => r.auth.user);
  const [tenancies, setTenancies] = useState<Tenancy[]>();
  const [showSignModal, setShowSignModal] = useState(false);
  const [currViewSignId, setCurrentTenancySignId] = useState(0);
  const myTenancy = tenancies?.find(ten => ten.Tenants.find(t => t.userId === loginUsr?.id));
  const myTenant = myTenancy?.Tenants.find(t => t.userId === loginUsr?.id);
  const currentTenancySigning = tenancies?.find(t => t.id === currViewSignId);
  const currentAgreement = currentTenancySigning?.TenancyDocuments.find(doc => doc.documentType === "tenancy-agreement");
  const PDFIframe = useRef<any>();
  const signatureCanvas = useRef<any>();
  const pad = useRef<any>();
  const pdf = useRef<any>();
  const [fetchedPDF, setFetchedPDF] = useState<any>();
  const [showSignaturePad, setshowSignaturePad] = useState(false);
  const allowNewSignature = currentAgreement && !currentAgreement.metadata?.tenantsSignData.find(sd => sd.email === loginUsr?.email);
  const landlordSigned = currentAgreement && currentAgreement.metadata?.landlordSignData?.dateTime;
  const tenantSigned = currentAgreement && currentAgreement?.metadata?.tenantsSignData?.length && currentAgreement?.metadata?.tenantsSignData?.length > 0;
  const tenantSignData = currentAgreement && currentAgreement?.metadata?.tenantsSignData;
  const allowPDFDownload = currentAgreement; // && (tenancyAgreement.metadata?.landlordSignData || tenancyAgreement.metadata?.tenantsSignData);
  const downloadText = tenantSigned || landlordSigned ? "Download Signed PDF" : "Download Unsigned PDF";

  const downloadPDF = async () => {
    const bytes = await pdf.current.save();
    var blob = new Blob([bytes], { type: "application/pdf" }); // change resultByte to bytes

    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `homebase_agreement_${currentAgreement?.tenancyId}.pdf`;
    link.click();
  };

  const loadPDF = async onGoingTenancies => {
    if (!onGoingTenancies || onGoingTenancies?.length === 0) return;
    const existingPdfBytes = await fetch(`/api/tenancy-document/${onGoingTenancies[0].id}`).then(res => res.arrayBuffer());
    setFetchedPDF(existingPdfBytes);
    pdf.current = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
    const pdfDataUri = await pdf.current.saveAsBase64({ dataUri: true });

    // viewing pdf on browser not avalible in mobile. Need to download
    // error - no enabled plugin supports this mime type pdf mobile
    // can also set the source direct `/api/tenancy-document/${onGoingTenancies[0].id}`;
    PDFIframe.current.src = pdfDataUri;
  };

  const loadSignaturePad = async onGoingTenancies => {
    if (!onGoingTenancies || onGoingTenancies?.length === 0) return;
    pad.current = new SignaturePad(signatureCanvas.current);
  };

  const fetchTenancy = async () => {
    const res = await axios.get("/api/tenancy/user");
    if (res.status === 200) {
      setTenancies(res.data);
      const ongoingTenancies = res.data.filter((t: Tenancy) => t.tenancyStatus !== "ended");
      loadPDF(ongoingTenancies);
      loadSignaturePad(ongoingTenancies);
    }
  };

  const signPDF = async () => {
    const hasLandlordSigned = currentAgreement?.metadata?.landlordSignData?.dateTime;
    const newPDF = await PDFDocument.load(fetchedPDF, { ignoreEncryption: true });
    const dataURL = pad.current.toDataURL();

    const pngImage = await newPDF.embedPng(dataURL);
    const pngDims = pngImage.scale(0.5);

    // Add a blank page to the document if none was added yet
    const willAddPage = hasLandlordSigned || tenantSigned;
    const page = willAddPage ? newPDF.getPage(newPDF.getPageCount() - 1) : newPDF.addPage();
    const dateTime = dayjs().format("DD MMM, YYYY h:mm A");
    const text = `${loginUsr?.Profile?.firstName} ${loginUsr?.Profile?.lastName} - ${dateTime}_____________________`;

    // ------- CHECK POINT
    // Goes from bottom to top
    // Draw the JPG image in the center of the page
    const onGoingTenancies = tenancies?.filter(t => t.tenancyStatus !== "ended" && t.isHistory === false);

    // defaults to 200 multiply by * the amount of tenants already signed
    const verticalOffset =
      currentAgreement?.metadata?.tenantsSignData.length && currentAgreement?.metadata?.tenantsSignData.length >= 1
        ? currentAgreement?.metadata?.tenantsSignData.length + 2 * 150
        : 200;
    page.drawImage(pngImage, {
      x: page.getWidth() / 1.5 - pngDims.width / 2,
      y: page.getHeight() - (verticalOffset + 30),
      width: pngDims.width,
      height: pngDims.height
    });

    // Draw the string of text on the page
    page.drawText(text, {
      x: 40,
      y: page.getHeight() - (verticalOffset + 40),
      size: 15,
      color: rgb(0, 0.53, 0.71)
    });
    const pdfDataUri = await newPDF.saveAsBase64({ dataUri: true });
    PDFIframe.current.src = pdfDataUri;
    const bytes = await newPDF.save();
    if (!onGoingTenancies) return;

    // upload doc for all tenancies on that 1 property
    for (let i = 0; i < onGoingTenancies.length; i++) {
      const curTenancy = onGoingTenancies[i];
      const body: any = {
        tenancyId: curTenancy.id,
        tenantId:
          curTenancy.Tenants.find(t => t.userId === loginUsr?.id)?.id || onGoingTenancies.map(t => t.Tenants.find(t => t.userId === loginUsr?.id)?.id)[0],
        file: bytes.buffer,
        signer: "tenant",
        dateTime: dateTime
      };
      if (!body.file) {
        toast.error("please select a file to upload");
        return;
      }
      const uploaRes = await axios.post("/api/tenancy-document/upload-agreement", body, { headers: { "Content-Type": "multipart/form-data" } });
      if (uploaRes.status === 200) {
        toast.success("Upload Success");
      }
      if (uploaRes.status !== 200) toast.error("Oops, Something went wrong uploading your file.");
    }
    fetchTenancy();
  };

  useEffect(() => {
    fetchTenancy();
  }, [showSignaturePad, showSignModal]);

  // Refactor
  // TODO Seperate Owned Tenancy and then loop the Related Tenants Under Same HouseHold
  // Instead of trying to figure this out in the loop below
  return (
    <div className="px-md-5">
      <h4 className="py-4 ps-md-5 strong-text">My Tenancies</h4>
      {!tenancies && (
        <div className="my-3 text-center" style={{ justifyItems: "center" }}>
          {" "}
          <div>
            <h4 className="fw-bolder">You have no active tenancies</h4>
          </div>
          <div>
            <img src="/static/no-message.png"></img>
          </div>{" "}
        </div>
      )}
      <div>
        {tenancies?.map((currTenancy, i) => {
          const leadTenant = currTenancy?.Tenants?.find(t => t.id === currTenancy.leadTenantid);
          const currIsMyTenancy = currTenancy.userId === loginUsr?.id;
          const currTenancyAgreement = currTenancy.TenancyDocuments.find(doc => doc.documentType === "tenancy-agreement" && doc.tenancyId === currTenancy.id);
          const currShowViewAndSignButton =
            currIsMyTenancy && currTenancyAgreement && currTenancyAgreement.metadata?.tenantsSignData?.find(sd => sd.email === loginUsr?.email) == undefined;
          const signData = currTenancyAgreement?.metadata?.tenantsSignData;
          const mySignData = currIsMyTenancy && signData?.find(sd => sd.email === loginUsr?.email);
          // && tenancyAgreement.tenancyId === myTenancy?.id;
          return (
            <div key={i}>
              <div className="pb-5 ps-md-5">
                <h5>
                  {currTenancy?.addressString}
                  {currTenancy?.tenancyStatus !== "ongoing" ? (
                    <span style={{ paddingLeft: "0.5em", WebkitTextStroke: "0.7px" }} className="text-danger">
                      <button type="button" className="btn btn-sm btn-outline-danger disabled">
                        {currTenancy?.tenancyStatus}
                      </button>
                    </span>
                  ) : (
                    <span style={{ paddingLeft: "0.5em", WebkitTextStroke: "0.7px" }} className="text-secondary">
                      <button type="button" className="btn btn-outline-secondary">
                        {currTenancy?.tenancyStatus}
                      </button>
                    </span>
                  )}
                </h5>
              </div>
              <div className="mx-md-5">
                <h5>Tenant</h5>
                <table className="table table table-borderless">
                  <tbody>
                    {currTenancy?.Tenants.map((currTenant, i) => {
                      const isTenancyOwnedByMe = currTenancy.userId == loginUsr?.id;
                      const matchedSignFromCurrTenancy = currTenancyAgreement?.metadata?.tenantsSignData?.find(
                        sd => sd.tenancyId === currTenancy.id && sd.tenantId === currTenant.id
                      );
                      const currentSignByMeFromMyTenancy = currTenancyAgreement?.metadata?.tenantsSignData?.find(
                        sd => sd.tenancyId === currTenancy.id && sd.email === loginUsr?.email
                      );
                      const isSignedByMe = matchedSignFromCurrTenancy?.email === loginUsr?.email;
                      // const matchedSignedByOther = cur
                      return (
                        <tr key={i}>
                          <td>
                            {currTenant.firstName} {currTenant.lastName}
                          </td>
                          <td>
                            {isSignedByMe ? "Signed:" : "Signature:"}{" "}
                            {isTenancyOwnedByMe
                              ? currentSignByMeFromMyTenancy?.dateTime
                                ? currentSignByMeFromMyTenancy?.dateTime
                                : "Pending"
                              : matchedSignFromCurrTenancy?.dateTime
                              ? matchedSignFromCurrTenancy?.dateTime
                              : "Pending"}{" "}
                            {/**: <span className="text-danger">Pending</span>}{" "} */}
                            {currShowViewAndSignButton && !isSignedByMe && (
                              <button
                                onClick={() => {
                                  setShowSignModal(true);
                                  setCurrentTenancySignId(currTenancy.id);
                                }}
                                className="btn-sm btn-success ms-3"
                              >
                                {" "}
                                View & Sign
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mx-md-5">
                <h5>Landlord</h5>
                <table className="table table table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        {currTenancy?.PropertyForRent.Listing.ListingLandlord?.firstName} {currTenancy?.PropertyForRent.Listing.ListingLandlord?.lastName}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
              </div>
              <div className="ms-md-5">
                <h5>Tenancy</h5>
                <table className="table table table-borderless">
                  <thead>
                    <tr style={{ WebkitTextStroke: "0.5px" }}>
                      <th scope="col">Start Date</th>
                      <th scope="col">Lead Tenant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{currTenancy?.rentalAgreementDate ? dayjs(currTenancy?.rentalAgreementDate).format("MMM D, YYYY") : "Pending"}</td>
                      <td>{currTenancy.firstName !== leadTenant?.firstName ? "No" : "Yes"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="ms-md-5">
                <h5>Deposit Information</h5>
                <table className="table table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{currTenancy?.deposit ? `$${currTenancy.deposit}` : "NA"}</td>
                      <td>
                        {currTenancy?.isDepositPaid && "Paid"}{" "}
                        <td>
                          {currTenancy?.isDepositReleased && "Released"}{" "}
                          {!currTenancy.isDepositPaid && !currTenancy.isDepositReleased && <span className="text-danger">Awaiting</span>}
                        </td>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
              </div>
            </div>
          );
        })}
      </div>
      <Modal show={showSignModal} onHide={() => null} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title style={{ width: "100%" }}>
            <div className="d-flex">
              <div>View & Sign</div>
              <div className="ms-auto">
                <CloseButton onClick={() => setShowSignModal(false)} />
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {allowPDFDownload && (
            <div className="pb-4">
              {currentAgreement && <div className="d-md-none text-center text-danger pb-3">Download to view</div>}
              <div className="point" onClick={() => downloadPDF()} style={{ width: "fit-content" }}>
                {downloadText} <i className="bi bi-download ps-2" />
              </div>
            </div>
          )}
          {currentAgreement && <iframe className="d-none d-md-block" ref={PDFIframe} id="pdf" width="100%" height={650} />}
          {allowNewSignature && (
            <div>
              <div className="btn btn-link" onClick={() => setshowSignaturePad(true)}>
                + Add Signature
              </div>
              {showSignaturePad && (
                <div className="w-100">
                  <canvas
                    // onTouchStart={() => {setForceRefresh(Math.random())}}
                    // onTouchStartCapture={() => {setForceRefresh(Math.random())}}
                    style={{ zIndex: +20, border: "1px solid black", width: "100%", height: "100%" }}
                    ref={signatureCanvas}
                    id="signature"
                  />
                  <button className="btn btn-secondary mb-5 me-3" onClick={() => pad.current.clear()}>
                    Clear
                  </button>
                  <button className="btn btn-secondary mb-5" onClick={() => signPDF()}>
                    Sign
                  </button>
                </div>
              )}
            </div>
          )}
          {landlordSigned && <div style={{ fontSize: "13px" }}>Agent Signed: {currentAgreement.metadata?.landlordSignData.dateTime}</div>}
          {tenantSigned &&
            tenantSignData?.map((sd, i) => (
              <div key={i} style={{ fontSize: "13px" }}>
                {sd.name} Signed: {sd.dateTime}
              </div>
            ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default connect()(MyTenancy);
