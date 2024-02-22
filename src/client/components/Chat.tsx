import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { setActiveConversation } from "../redux/reducers/messagesReducer";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
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
    return () => {
      dispatch(setActiveConversation(null));
    };
  }, []);

  return (
    <div className="enquiry-message-wrapper">
      <div className="d-flex w-100 flex-column align-items-center">
        <div className="d-flex chat-header py-3 px-md-5 px-lg-5 w-100" style={{ borderBottom: "1px solid #eaecef", marginBottom: "10px" }}>
          <img
            src={listing?.ListingMedia.find(m => m.label === "1")?.mediaUrl}
            style={{ height: "40px", width: "40px", borderRadius: "5px", marginRight: "30px" }}
          />
          <strong>{activeConvoTitle}</strong>
          {mobileView && <button className="btn-close ms-auto" onClick={() => dispatch(setActiveConversation(null))}></button>}
          {activeConversation && !mobileView && (
            <div className="ms-auto pe-2 fs-5">
              <i className="bi bi-three-dots point" onClick={() => setShowDesktopOptionsMenu(!showDesktopOptionsMenu)} />
              {!mobileView && showDesktopOptionsMenu && (
                <div
                  className="options-menu rounded"
                  style={{ backgroundColor: "#46778399", marginLeft: "-150px", width: "170px", position: "absolute", zIndex: +10 }}
                >
                  <ul className="list-group point">
                    {isTenant && (
                      <li
                        onClick={() => {
                          setShowDesktopOfferModal(!showDesktopOfferModal);
                          setShowDesktopOptionsMenu(false);
                        }}
                        className="list-group-item"
                      >
                        Make an offer
                      </li>
                    )}
                    <li className="list-group-item" onClick={() => navigate(`/property/rent/${activeConversation.Listing.id}`)}>
                      View Property
                    </li>
                    <li className="list-group-item">Add to Favorites</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="d-flex flex-column col-12 col-md-10 chat-area" style={{ paddingBottom: "60px", height: "60vh", overflow: "scroll" }}>
          <div className="intro-msg rounded-pill ms-5 mb-5 ps-3 text-muted">{introMessage}</div>
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
      {/* Mobile Offer Modal */}
      <Modal show={showDesktopOfferModal} aria-labelledby="contained-modal-title-vcenter" centered>
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
            <Button type="button" variant="secondary" onClick={() => setShowDesktopOfferModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default connect()(Chat);
