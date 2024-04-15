import React, { FormEvent, LegacyRef, MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { connect, useSelector } from "react-redux";
import ViewRentProperty from "../ViewRentProperty";
import { RootState } from "../../redux/store";
import Listing from "../../../database/models/listing";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import OfferList from "../../components/landlord-n-admin/OfferList";
import DocumentList from "../../components/landlord-n-admin/DocumentList";
import { setActiveConversation } from "../../redux/reducers/messagesReducer";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Accordion, Button, Dropdown, DropdownButton, Modal, Offcanvas } from "react-bootstrap";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import SignaturePad from "signature_pad";
import dayjs from "dayjs";
import Tenancy from "../../../database/models/tenancy";
import InvitationCanvas from "../../components/InvitationCanvas";
import { tenancyStatusSequence } from "../../../utils/statusSequence";
import stringToBoolean from "../../../utils/stringToBoolean";
import EditTenancyModal from "../../components/EditTenancyModal";

const UploadModal = (props: any) => {
  return (
    <>
      <Modal show={props.show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>In Progress....</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

const ManageSingleProperty = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const listingId = params.id;
  const [listing, setListing] = useState<Listing>();
  const property = listing?.PropertyForRent;
  const tenancies = property?.Tenancies;
  const onGoingTenancies = tenancies?.filter(t => t.tenancyStatus !== "ended");
  const tenancyAgreement = onGoingTenancies && onGoingTenancies[0]?.TenancyDocuments?.find(d => d.documentType === "tenancy-agreement");
  const expenses = property?.Expenses;
  const propertyDocs = property?.PropertyDocuments;
  const offers = listing?.Offers;
  const loginUsr = useSelector((r: RootState) => r.auth.user);
  const [allowedToView, setAllowedToView] = useState(true);
  const uploadTAgreemFormRef = useRef<any>();
  const PDFIframe = useRef<any>();
  const signatureCanvas = useRef<any>();
  const pad = useRef<any>();
  const pdf = useRef<any>();
  const [fetchedPDF, setFetchedPDF] = useState<any>();
  const [showSignaturePad, setshowSignaturePad] = useState(false);
  const [uploading, setUploading] = useState(false);
  const allowNewSignature = tenancyAgreement && !tenancyAgreement.metadata?.landlordSignData;
  const landlordSigned = tenancyAgreement && tenancyAgreement.metadata?.landlordSignData?.dateTime;
  const tenantSigned = tenancyAgreement && tenancyAgreement?.metadata?.tenantsSignData?.length && tenancyAgreement?.metadata?.tenantsSignData?.length > 0;
  const tenantSignData = tenancyAgreement && tenancyAgreement?.metadata?.tenantsSignData;
  const allowPDFDownload = tenancyAgreement; // && (tenancyAgreement.metadata?.landlordSignData || tenancyAgreement.metadata?.tenantsSignData);
  const downloadText = tenantSigned || landlordSigned ? "Download Signed PDF" : "Download Unsigned PDF";
  const [showInviteCanvas, setShowInviteCanvas] = useState(false);
  const [selectedTenToManage, setSelectedTenToManage] = useState<Tenancy>();

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

  const downloadPDF = async () => {
    const bytes = await pdf.current.save();
    var blob = new Blob([bytes], { type: "application/pdf" }); // change resultByte to bytes

    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `homebase_agreement_${tenancyAgreement?.tenancyId}.pdf`;
    link.click();
  };

  const loadSignaturePad = async onGoingTenancies => {
    if (!onGoingTenancies || onGoingTenancies?.length === 0) return;
    pad.current = new SignaturePad(signatureCanvas.current);
  };

  const initialLoad = async () => {
    const res = await axios.get(`/api/listing/rent/expanded/${listingId}`);
    if (res.data.message === "Unauthorized") {
      setAllowedToView(false);
      return;
    }
    setListing(res.data);
    const activeTenancies = res.data?.PropertyForRent?.Tenancies?.filter(t => t.tenancyStatus !== "ended");
    await loadPDF(activeTenancies);
    await loadSignaturePad(activeTenancies);
    console.log(res.data);
  };

  const signPDF = async () => {
    const hasTenantSigned = tenancyAgreement?.metadata?.tenantsSignData.filter(d => d?.dateTime);
    const newPDF = await PDFDocument.load(fetchedPDF, { ignoreEncryption: true });
    const dataURL = pad.current.toDataURL();

    const pngImage = await newPDF.embedPng(dataURL);
    const pngDims = pngImage.scale(0.5);

    // Add a blank page to the document if none was added yet
    const page = hasTenantSigned ? newPDF.getPage(newPDF.getPageCount() - 1) : newPDF.addPage();
    const dateTime = dayjs().format("DD MMM, YYYY h:mm A");
    const text = `${loginUsr?.Profile?.firstName} ${loginUsr?.Profile?.lastName} - ${dateTime}_____________________`;

    // Goes from bottom to top
    // Draw the JPG image in the center of the page
    page.drawImage(pngImage, {
      x: page.getWidth() / 1.5 - pngDims.width / 2,
      y: page.getHeight() - 130,
      width: pngDims.width,
      height: pngDims.height
    });

    // Draw the string of text on the page
    page.drawText(text, {
      x: 40,
      y: page.getHeight() - 140,
      size: 15,
      color: rgb(0, 0.53, 0.71)
    });

    const pdfDataUri = await newPDF.saveAsBase64({ dataUri: true });
    PDFIframe.current.src = pdfDataUri;
    const bytes = await newPDF.save();
    if (!onGoingTenancies) return;

    const resultArray: string[] = [];
    // upload doc for all tenancies on that 1 property
    for (let i = 0; i < onGoingTenancies.length; i++) {
      setUploading(true);
      const curTenancy = onGoingTenancies[i];
      const body: any = { tenancyId: curTenancy.id, file: bytes.buffer, signer: "property_manager", dateTime: dateTime };
      if (!body.file) {
        toast.error("please select a file to upload");
        return;
      }

      const uploadRes = await axios.post("/api/tenancy-document/upload-agreement", body, { headers: { "Content-Type": "multipart/form-data" } });
      if (uploadRes.status === 200) {
        resultArray.push("success");
      }
      if (uploadRes.status !== 200) resultArray.push("failed");
    }
    const failedUploads = resultArray.find(r => r === "failed");
    if (failedUploads) {
      toast.error("Oops, Something went wrong uploading file. Please Try again");
    } else {
      toast.success("Upload Success.");
    }
    initialLoad();
    setUploading(false);
  };

  //Accept or decline
  const onSubmitOffer = async (offerId, status) => {
    if (!listing) return;
    const res = await axios.post("/api/offer/status", { offerId, status, listingId: listing.id });
    if (res.status === 200) {
      toast.info(`Offer has been ${status}`);
      initialLoad();
    } else {
      toast.error("Opps something went wrong. Please try again");
      initialLoad();
    }
  };

  const onClickViewEnquiry = (userId: number) => {
    const foundEnquiry = listing?.EnquiryConversations?.find(enq => enq.userId === userId);
    if (foundEnquiry) {
      dispatch(setActiveConversation(foundEnquiry));
      navigate("/enquiries");
    }
  };

  const uploadTenancyAgrem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onGoingTenancies?.length === 0) {
      toast.error("Find a tenant before uploading documents for this tenancy period");
      return;
    }
    if (!onGoingTenancies) {
      console.log("no ongoing tenancies");
      return;
    }

    const resultArray: string[] = [];

    for (let i = 0; i < onGoingTenancies.length; i++) {
      setUploading(true);
      const curTenancy = onGoingTenancies[i];

      const formData = new FormData(uploadTAgreemFormRef.current || undefined);
      const body: any = { tenancyId: curTenancy.id };
      for (var pair of formData.entries()) {
        body[pair[0]] = pair[1];
      }
      if (!body.file.name) {
        toast.error("please select a file to upload");
        return;
      }

      const res = await axios.post("/api/tenancy-document/upload-agreement", body, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.status === 200) {
        resultArray.push("success");
      }
      if (res.status !== 200) resultArray.push("failed");
    }

    const failedUploads = resultArray.find(r => r === "failed");
    if (failedUploads) {
      toast.error("Oops, Something went wrong uploading your file. Please Try again");
    } else {
      toast.success("Upload Success. You Will have to re-upload this doc for newly added tenants");
    }
    initialLoad();
    setUploading(false);
  };

  const sendInvite = async (email, firstName, lastName) => {
    if (!email || !firstName || !lastName) {
      toast.error("Please fill in the details");
      return;
    }

    const res = await axios.post("/api/invite/send-invitation", { email, firstName, lastName, propertyForRentId: property?.id });
    if (res.status === 200) {
      toast.success("Invitation Sent");
      setShowInviteCanvas(false);
    }
    if (res.status !== 200) toast.error("Error sending invite. Please Try again");
  };

  useEffect(() => {
    initialLoad();
  }, [showSignaturePad]);

  if (!allowedToView && listing) return <h3>You do not have permission to view this page</h3>;

  return (
    <div className="p-md-5">
      <EditTenancyModal
        selectedTenToManage={selectedTenToManage}
        property={property}
        setSelectedTenToManage={setSelectedTenToManage}
        initialLoad={initialLoad}
      />
      <UploadModal show={uploading} />
      <InvitationCanvas
        onGoingTenancies={onGoingTenancies}
        showInviteCanvas={showInviteCanvas}
        setShowInviteCanvas={setShowInviteCanvas}
        sendInvite={sendInvite}
      />
      <h3 className="pt-2">Manage Property</h3>
      <div className="pt-5 pb-5">
        <h5>Offers</h5>
        <OfferList offers={offers} onSubmitOffer={onSubmitOffer} onClickViewEnquiry={onClickViewEnquiry} />
      </div>
      <div className="pt-5 pb-5">
        <h5>Attached Documents</h5>
        <DocumentList initialLoad={initialLoad} property={property} />
      </div>
      <div className="pt-5 pb-5">
        <h5>Tenancy Agreement</h5>
        <Accordion style={{ maxWidth: "500px" }}>
          <Accordion.Header>View & Sign</Accordion.Header>
          <Accordion.Body>
            {allowPDFDownload && (
              <div className="pb-4">
                {tenancyAgreement && <div className="d-md-none text-center text-danger pb-3">Download to view</div>}
                <div className="point" onClick={() => downloadPDF()} style={{ width: "fit-content" }}>
                  {downloadText} <i className="bi bi-download ps-2" />
                </div>
              </div>
            )}
            {tenancyAgreement && <iframe className="d-none d-md-block" ref={PDFIframe} id="pdf" width="100%" height={650} />}
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
            {landlordSigned && <div style={{ fontSize: "13px" }}>Agent Signed: {tenancyAgreement.metadata?.landlordSignData.dateTime}</div>}
            {tenantSigned &&
              tenantSignData?.map((sd, i) => (
                <div key={i} style={{ fontSize: "13px" }}>
                  {sd.name} Signed: {sd.dateTime}
                </div>
              ))}
            <form ref={uploadTAgreemFormRef} onSubmit={uploadTenancyAgrem}>
              <hr />
              <div className="d-flex pt-3 flex-row align-items-center">
                <input
                  name="file"
                  className="form-control form-control-sm "
                  style={{ width: "180px", height: "2em", fontSize: "11px" }}
                  type="file"
                  accept="application/pdf"
                />
                <button style={{ fontSize: "11px" }} className="btn btn-link" type="submit">
                  Upload New pdf
                </button>
              </div>
            </form>
          </Accordion.Body>
        </Accordion>
        <Accordion style={{ maxWidth: "500px" }}>
          <Accordion.Header>Tenancy Details</Accordion.Header>
          {onGoingTenancies?.length && (
            <Accordion.Body>
              <div>Length: {onGoingTenancies[0]?.lenghtInDays} days</div>
              <div>Start Date: {onGoingTenancies[0]?.rentalAgreementDate}</div>
              <div>Main Contact Email: {onGoingTenancies[0]?.mainContactEmail}</div>
              <div>Main Contact Number: {onGoingTenancies[0]?.mainContactNumber}</div>
              <div className="pt-4">
                Status: <br /> {!tenantSigned && "Tenant"} <br />
                {!landlordSigned && "Property Manager"}
                <br /> {onGoingTenancies[0]?.tenancyStatus}
              </div>
            </Accordion.Body>
          )}
        </Accordion>
      </div>
      <div className="pt-5 pb-5">
        <h5>Tenants</h5>
        <div>
          {onGoingTenancies?.map((curTenancy, curIndex) => {
            return curTenancy.Tenants.map((curTenant, i) => {
              const tenantName = `${curTenant.firstName} ${curTenant.lastName}`;

              return (
                <div key={curIndex}>
                  <div>
                    {tenantName}{" "}
                    <button className="btn text-primary ps-0" onClick={() => setSelectedTenToManage(curTenancy)}>
                      Manage Tenant
                    </button>
                  </div>
                </div>
              );
            });
          })}
          <div className="invitation-btn">
            <button className="btn text-primary px-0 pt-5" onClick={() => setShowInviteCanvas(true)}>
              Invite new tenant
            </button>
          </div>
        </div>
      </div>
      <div className="pb-5">
        <h5>Expense & Financial Rent Data</h5>
        <button className="btn text-primary ps-0" onClick={() => navigate(`/property/rent/${listing && listing?.id}/expense`)}>
          Data Entry
        </button>
      </div>
      <div>
        <h5>Payments</h5>
        <button className="btn text-primary ps-0" onClick={() => navigate(`/property/rent/${listing && listing?.id}/payments`)}>
          Manage/Setup Payments
        </button>
      </div>
      <div className="d-flex">
        <div className="ms-auto btn">
          <i className="bi bi-pencil pe-1" />
          Edit
        </div>
      </div>
      <ViewRentProperty />
    </div>
  );
};

export default connect()(ManageSingleProperty);
