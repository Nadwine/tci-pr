import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import EnquiryConversation from "../../database/models/enquiry_conversation";
import { RootState } from "../redux/store";
import { setActiveConversation, setConversations } from "../redux/reducers/messagesReducer";
import Chat from "../components/Chat";
import Message from "../../database/models/message";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";
import dayjs from "dayjs";
import DesktopMessageEnquires from "./DesktopMessageEnquires";
import { Button, Modal, ModalProps, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import listing from "../../database/models/listing";

const MessageEnquiries = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const enquiries = useSelector((root: RootState) => root.message.conversations);
  const activeConversation = useSelector((root: RootState) => root.message.activeConversation);
  const loginUsr = useSelector((r: RootState) => r.auth.user);
  const [chatTextbox, setChatTextbox] = useState("");
  const [showMobileOptionsMenu, setShowMobileOptionsMenu] = useState(false);
  const [showMobileOfferModal, setShowMobileOfferModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const userId = loginUsr!.id;
  const isAdmin = loginUsr?.accountType === "admin";
  const isTenant = loginUsr?.accountType === "tenant";
  const alreadySentOffer = activeConversation?.Listing.Offers?.find(off => off.userId === loginUsr?.id);

  const mql = window.matchMedia("(max-width: 600px)");

  let mobileView = mql.matches;

  const loadData = async () => {
    const res = await axios.get("/api/enquiry/latest");
    if (res.status === 200) {
      console.log("Enquiryies", res.data);
      dispatch(setConversations(res.data));
    }
  };

  const submitSeen = async (enq: EnquiryConversation) => {
    const res = await axios.post("/api/enquiry/set-seen", { enquiryId: enq.id });
    if (res.status === 200) return;
    console.log("fail to set msg as seen");
  };

  const sendMessage = async (text: string) => {
    if (!activeConversation || !text) {
      toast.error("error sending message. try again");
      return;
    }

    //@ts-expect-error
    const message: Message = {
      userId: userId,
      enquiryConversationId: activeConversation!.id,
      messageText: text,
      messageType: "text"
    };

    const res = await axios.post("/api/message/enquiry", message);
    if (res.status !== 200) {
      toast.error("error sending message. try again");
      return;
    } else {
      // Success update Redux state
      const newActiveConvo = cloneDeep(activeConversation);
      newActiveConvo.Messages.push(message);
      dispatch(setActiveConversation(newActiveConvo));

      // clear textbox
      setChatTextbox("");
    }
  };

  const submitOffer = async e => {
    e.preventDefault();
    if (alreadySentOffer) {
      toast.error("Offer already sent. Please wait for a reply");
      setShowMobileOfferModal(false);
      return;
    }
    const formData = new FormData(formRef.current || undefined);
    const body: any = { listingId: activeConversation?.listingId };
    for (var pair of formData.entries()) {
      body[pair[0]] = pair[1];
    }
    const res = await axios.post("/api/offer/send", body);
    if (res.status === 200) {
      toast.success("Offer sent");
      setShowMobileOfferModal(false);
    } else {
      if (res.data.message === "Profile Incomplete. Taking you to profile page...") {
        setTimeout(() => navigate("/user"), 4000);
      }
      toast.error(`Error sending offer - ${res.data.message}`);
      return;
    }
  };

  const getConvoUser = (enq: EnquiryConversation) => {
    const profile = enq?.User.Profile;
    const landlordOrAdminProfile = enq?.Listing.ListingLandlord || enq.Listing.Admin?.User?.Profile;
    if (isTenant) {
      // tenant
      if (landlordOrAdminProfile?.firstName && landlordOrAdminProfile?.lastName) {
        return `${landlordOrAdminProfile.firstName} ${landlordOrAdminProfile?.lastName}`;
      }
      return `${activeConversation?.Listing.ListingLandlord?.firstName}`;
    } else {
      // landlord
      if (profile?.firstName && profile.lastName) {
        return `${profile.firstName} ${profile?.lastName}`;
      } else {
        return activeConversation?.User.email;
      }
    }
  };

  const onClickCovo = (enq: EnquiryConversation) => {
    dispatch(setActiveConversation(enq));
    submitSeen(enq);
  };

  useEffect(() => {
    loadData();
  }, []);

  return enquiries.length > 0 ? (
    <div>
      {mobileView && (
        <div className="message-view-wrapper d-md-none d-lg-none d-xl-none">
          <div className="d-flex align-items-center">
            {!activeConversation && mobileView && <h3 className="px-4 mt-4 ps-1 fw-bolder">Your Enquiries</h3>}
            {activeConversation && (
              <div className="w-100 pe-2 fs-5 pt-2">
                <button className="btn float-start" style={{ height: "3px" }} onClick={() => dispatch(setActiveConversation(null))}>
                  <i className="bi bi-chevron-left float-left" style={{ WebkitTextStrokeWidth: "3px" }}></i>
                </button>
                <i className="bi bi-three-dots float-end point" onClick={() => setShowMobileOptionsMenu(!showMobileOptionsMenu)} />
                {showMobileOptionsMenu && (
                  <div
                    className="options-menu rounded"
                    style={{ backgroundColor: "#46778399", marginLeft: "150px", marginTop: "2em", width: "170px", position: "absolute", zIndex: +10 }}
                  >
                    <ul className="list-group">
                      {isTenant && (
                        <li
                          onClick={() => {
                            setShowMobileOfferModal(!showMobileOfferModal);
                            setShowMobileOptionsMenu(false);
                          }}
                          className="list-group-item"
                        >
                          Make an offer
                        </li>
                      )}
                      <li className="list-group-item">View Property</li>
                      <li className="list-group-item">Add to Favorites</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          {!activeConversation && <hr className="text-secondary w-100"></hr>}
          {/* Conversation List start */}
          {!activeConversation &&
            enquiries.map((enq, i) => {
              const lastMessage = enq.Messages[enq.Messages.length - 1];
              const hasUnreadMessages = enq.Messages.filter(m => m.userId !== userId && m.seenAt == null).length > 0;
              const landlordManaged = enq.Listing.listingManager === "landlord";
              return (
                <div onClick={() => onClickCovo(enq)} key={i} className="row" style={{ height: "95px" }}>
                  <div
                    className="col-10 d-flex justify-content-start me-5 ms-2 mt-2 mb-2 point"
                    style={{ height: "70px", color: hasUnreadMessages ? "black" : "grey" }}
                  >
                    <div className="col-1 d-flex justify-content-end">
                      <img src={enq.Listing.ListingMedia[0]?.mediaUrl} style={{ height: "40px", width: "40px", borderRadius: "5px" }} />
                    </div>
                    <div style={{ marginLeft: "25px", width: "100%" }} className=" pe-1 pe-md-5 pe-lg-5">
                      <span style={{ fontWeight: "bold" }}>{getConvoUser(enq)}</span>
                      <p className="pe-sm-2 mb-0" style={{ float: "right", minWidth: "3rem" }}>
                        <small>{dayjs(enq.createdAt).format("MMM D")}</small>
                      </p>
                      {/**todo: fix elipsis on bigger screen */}
                      <p style={{ width: "300px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{lastMessage?.messageText}</p>
                      {isAdmin && landlordManaged && <span className="text-danger">Managed by Landlord</span>}
                    </div>
                  </div>
                  <hr style={{ color: "grey" }}></hr>
                </div>
              );
            })}
          {/* Conversation List end */}
          {activeConversation && (
            <div className="d-flex flex-column">
              <Chat onSend={sendMessage} textboxVal={chatTextbox} onChangeTextboxVal={setChatTextbox} />
            </div>
          )}
        </div>
      )}
      {!mobileView && <DesktopMessageEnquires />}

      {/* Mobile Offer Modal */}
      {/* <Modal show={showMobileOfferModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <form ref={formRef} onSubmit={submitOffer}>
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Submit an Offer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <input name="amount" className="form-control" type="text" placeholder="Rent Price" required />
            </div>
            <div className="mb-3">
              <input name="tenancyLengthDays" className="form-control" type="text" placeholder="Tenancy Length (Days)" required />
            </div>
            <div className="mb-3">
              <label className="text-muted">Preferred Tenancy Start date</label>
              <input
                name="preferredStartDate"
                min={dayjs().format("YYYY-MM-DD")}
                type="date"
                className="form-control"
                placeholder="Preferred Start Date"
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={() => setShowMobileOfferModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </form>
      </Modal> */}
      <Offcanvas show={showMobileOfferModal} onHide={() => setShowMobileOfferModal(false)}>
        <form ref={formRef} onSubmit={submitOffer}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Submit an Offer</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="mb-3">
              <input name="amount" className="form-control" type="text" placeholder="Rent Price" required />
            </div>
            <div className="mb-3">
              <input name="tenancyLengthDays" className="form-control" type="text" placeholder="Tenancy Length (Days)" required />
            </div>
            <div className="mb-3">
              <label className="text-muted">Preferred Tenancy Start date</label>
              <input
                name="preferredStartDate"
                min={dayjs().format("YYYY-MM-DD")}
                type="date"
                className="form-control"
                placeholder="Preferred Start Date"
                required
              />
              <button className="btn btn mt-4 text-light" style={{ backgroundColor: "#087990" }} type="submit">
                Submit
              </button>
            </div>
          </Offcanvas.Body>
        </form>
      </Offcanvas>
    </div>
  ) : (
    <div className="my-3 text-center" style={{ justifyItems: "center" }}>
      {" "}
      <div>
        <h3 className="fw-bolder">No Enquiries</h3>
      </div>
      <div>
        <img src="/static/no-message.png"></img>
      </div>{" "}
    </div>
  );
};

export default connect()(MessageEnquiries);
