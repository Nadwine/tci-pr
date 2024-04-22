import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { setActiveConversation } from "../redux/reducers/messagesReducer";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Offcanvas } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingSpinnerComponent } from "./LoadingSpinners";
import EnquiryConversation from "../../database/models/enquiry_conversation";
dayjs.extend(relativeTime);

type Props = {
  onSend: (text: string) => void;
  textboxVal: string;
  onChangeTextboxVal: (val: string) => void;
};

export const Chat = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDesktopOptionsMenu, setShowDesktopOptionsMenu] = useState(false);
  const [showDesktopOfferModal, setShowDesktopOfferModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { textboxVal, onChangeTextboxVal, onSend } = props;
  const logInUsr = useSelector((r: RootState) => r.auth.user);
  const loggedInUserId = logInUsr?.id;
  const formRef = useRef<HTMLFormElement>(null);
  const chats = useSelector((r: RootState) => r.message.activeConversation?.Messages) || [];
  const listing = useSelector((r: RootState) => r.message.activeConversation?.Listing);
  const activeConversation = useSelector((r: RootState) => r.message.activeConversation);
  const activeConvoTitle = useSelector((r: RootState) => r.message.activeConversation?.Listing.title);
  const introMessage = useSelector((r: RootState) => r.message.activeConversation?.intro_message);
  const isTenant = logInUsr?.accountType === "tenant";
  const alreadySentOffer = activeConversation?.Listing.Offers?.find(off => off.userId === logInUsr?.id);

  const isLandlord = logInUsr?.accountType === "landlord";
  const isAdmin = logInUsr?.accountType === "admin";
  const managedByAdmin = listing?.listingManager === "admin";
  const managedByLandlord = listing?.listingManager === "landlord";
  const isBasic = listing?.productPackage?.name === "basic";
  const isStandard = listing?.productPackage?.name === "standard";
  const isPremium = listing?.productPackage?.name === "premium";
  const isStandard_Or_Premium = isStandard || isPremium;

  const mql = window.matchMedia("(max-width: 600px)");

  let mobileView = mql.matches;

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTextboxVal(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      textboxVal && onSend(textboxVal);
    }
  };

  const submitOffer = async e => {
    e.preventDefault();
    if (alreadySentOffer) {
      toast.error("Offer already sent. Please wait for a reply");
      setShowDesktopOfferModal(false);
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
      setShowDesktopOfferModal(false);
    } else {
      if (res.data.message === "Profile Incomplete. Taking you to profile page...") {
        setTimeout(() => navigate("/user"), 4000);
      }
      toast.error(`Error sending offer - ${res.data.message}`);
      return;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      dispatch(setActiveConversation(null));
      clearTimeout(timer);
    };
  }, []);

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

  const saveUnsaveListing = async () => {
    const res = await axios.post(`/api/listing/${activeConversation?.Listing?.id}/save-unsave`);
    if (res.status === 200) toast.info(res.data.message);
    if (res.status !== 200) toast.error("Something went wrong saving this listing");
  };

  if (isLandlord && managedByAdmin) {
    return (
      <div className="px-md-5 py-5 text-muted">
        You have choose to have your property managed by us with your {listing?.productPackage?.name} package. Sit Back and let us handle this bit for you.
      </div>
    );
  }

  return (
    <div className="enquiry-message-wrapper">
      <div className="d-flex w-100 flex-column align-items-center">
        <div className="d-flex chat-header py-3 px-md-5 px-lg-5 w-100" style={{ borderBottom: "2px solid #eaecef", marginBottom: "10px" }}>
          <img
            src={listing?.ListingMedia.find(m => m.mediaType === "image")?.mediaUrl}
            style={{ height: "40px", width: "40px", borderRadius: "5px", marginRight: "30px" }}
          />
          <strong>{activeConvoTitle}</strong>
          {activeConversation && !mobileView && (
            <div className="ms-auto pe-2 fs-5">
              <i className="bi bi-three-dots point" onClick={() => setShowDesktopOptionsMenu(!showDesktopOptionsMenu)} />
              {!mobileView && showDesktopOptionsMenu && (
                <div
                  className="options-menu rounded"
                  style={{ backgroundColor: "#46778399", marginLeft: "-150px", width: "170px", position: "absolute", zIndex: +10 }}
                >
                  <ul className="list-group point">
                    {isTenant && isStandard_Or_Premium && (
                      <li
                        onClick={() => {
                          setShowDesktopOfferModal(!showDesktopOfferModal);
                          setShowDesktopOptionsMenu(false);
                        }}
                        className="list-group-item fs-5"
                      >
                        Make an offer
                      </li>
                    )}
                    <li className="list-group-item fs-5" onClick={() => navigate(`/property/rent/${activeConversation.Listing.id}`)}>
                      View Property
                    </li>
                    <li onClick={() => saveUnsaveListing()} className="list-group-item fs-5">
                      <i className="bi bi-heart" style={{ color: "pink" }} /> Favorite
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-primary" style={{ fontSize: "15px" }}>
          {activeConversation && getConvoUser(activeConversation)}
        </div>
        <div className="d-flex flex-column col-12 col-md-10 chat-area" style={{ paddingBottom: "60px", height: "60vh", overflow: "scroll" }}>
          <div className="intro-msg rounded-pill ms-5 mb-5 ps-3 text-muted">{introMessage}</div>
          {loading && (
            <div className="text-center">
              <LoadingSpinnerComponent />
            </div>
          )}
          {chats.map((msg, i) => (
            <div className="d-flex" key={i} style={{ marginLeft: msg.userId === loggedInUserId ? "auto" : "", marginBottom: "20px" }}>
              {msg.userId !== loggedInUserId && <i className="bi bi-person-circle pe-1" style={{ fontSize: "22px" }}></i>}
              <div className="text-and-time">
                <div
                  className="d-flex flex-column justify-content-center"
                  style={{
                    borderBottomLeftRadius: msg.userId == loggedInUserId ? "12px" : "",
                    borderBottomRightRadius: "12px",
                    borderTopRightRadius: msg.userId !== loggedInUserId ? "12px" : "",
                    borderTopLeftRadius: "12px",
                    padding: "2px 20px",
                    backgroundColor: msg.userId === loggedInUserId ? "#0082ff" : "#eaecef",
                    color: msg.userId === loggedInUserId ? "white" : "black",
                    width: "fit-content"
                  }}
                >
                  {msg.messageText} <div className="row-3" style={{ fontSize: "0.7em", marginLeft: "10px" }}></div>
                </div>
                <div className="row-3" style={{ fontSize: "0.5em", marginLeft: "10px" }}>
                  {dayjs(msg.createdAt).fromNow()}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="d-flex text-sender py-3 px-md-5 px-lg-5"
          style={{
            position: "absolute",
            left: "10px",
            bottom: mobileView ? "-2vh" : "7vh",
            height: "80px",
            width: "95%",
            zIndex: +20
          }}
        >
          <input
            onKeyUp={handleKeyPress}
            onChange={onChangeText}
            value={textboxVal}
            className="form-control mb-3"
            type="text"
            placeholder="Type new message..."
            style={{ width: "95%", borderRadius: "15px" }}
          />
          <button disabled={!textboxVal} onClick={() => textboxVal && onSend(textboxVal)} className="btn btn-primary ms-1 mb-3">
            <i className="bi bi-send" />
          </button>
        </div>
      </div>
      {/* Desktop Offer Canvas */}
      <Offcanvas show={showDesktopOfferModal} onHide={() => setShowDesktopOfferModal(false)}>
        <form ref={formRef} onSubmit={submitOffer}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Submit an Offer</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="mb-3">
              <input name="amount" className="form-control" type="text" placeholder="Rent Price" required />
            </div>
            <div className="mb-3">
              <label className="text-muted">
                Tenancy Lenght {"("}Days{")"}
              </label>
              <input
                readOnly
                name="tenancyLengthDays"
                defaultValue={activeConversation?.Listing.PropertyForRent.tenancyLength}
                className="form-control"
                type="text"
                placeholder="Tenancy Length (Days)"
              />
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
              <div className="card my-4 border-info" style={{ borderLeft: "5px solid #cff4fc", backgroundColor: "#cff4fc" }}>
                <div className="card-body">
                  {" "}
                  <i className="bi bi-info-circle-fill"></i> We recommend viewing the property before making an offer. Find out more about our safety tips
                  <button type="button" className="btn text-primary ps-1" onClick={() => navigate(`/rent/safety`)}>
                    here
                  </button>
                </div>
              </div>
              <button className="btn btn mt-4 text-light" style={{ backgroundColor: "#087990" }} type="submit">
                Submit
              </button>
            </div>
          </Offcanvas.Body>
        </form>
      </Offcanvas>
    </div>
  );
};

export default connect()(Chat);
