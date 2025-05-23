import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import EnquiryConversation from "../../database/models/enquiry_conversation";
import { RootState } from "../redux/store";
import { setActiveConversation, setConversations } from "../redux/reducers/messagesReducer";
import Chat from "../components/Chat";
import Message from "../../database/models/message";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const MessageEnquiries = props => {
  const dispatch = useDispatch();
  const enquiries = useSelector((root: RootState) => root.message.conversations);
  const activeConversation = useSelector((root: RootState) => root.message.activeConversation);
  const loginUsr = useSelector((r: RootState) => r.auth.user);
  const [chatTextbox, setChatTextbox] = useState("");
  const userId = loginUsr!.id;
  const isAdmin = loginUsr?.accountType === "admin";
  const isLandlord = loginUsr?.accountType === "landlord";
  const isTenant = loginUsr?.accountType === "tenant";

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

  const onClickConvo = (enq: EnquiryConversation) => {
    dispatch(setActiveConversation(enq));
    submitSeen(enq);
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

  useEffect(() => {
    loadData();
  }, []);

  return enquiries.length > 0 ? (
    <div className="d-flex flex-wrap justify-content-center">
      <h3 className="w-100 my-4 ms-5 fw-bolder">Your Enquiries</h3>
      <div className="card p-0 col-md-4 col-lg-4 shadow-sm" style={{ overflow: "scroll", height: "700px" }}>
        {/* Conversation List start */}
        {enquiries.map((enq, i) => {
          const hasMessages = enq?.Messages?.length > 0;
          const lastMessage = hasMessages && enq.Messages[enq.Messages.length - 1];
          const hasUnreadMessages = enq.Messages?.filter(m => m.userId !== userId && m.seenAt == null).length > 0;
          const landlordManaged = enq.Listing.listingManager === "landlord";
          const disablePreview = isLandlord && enq.Listing.listingManager === "admin";
          return (
            <div className="p-0" onClick={() => onClickConvo(enq)} key={i}>
              {/* <hr style={{ color: "grey" }}></hr> */}

              <div className="card-body border-bottom col-12 d-flex justify-content-start point" style={{ color: hasUnreadMessages ? "black" : "grey" }}>
                <div className="card-title col-1 d-flex justify-content-end overflow-hidden">
                  <img src={enq.Listing.ListingMedia.find(m => m.mediaType === "image")?.mediaUrl} style={{ height: "30px", width: "40px" }} />
                </div>
                <div style={{ marginLeft: "10px", width: "100%" }} className="card-title pe-1">
                  <div className="d-flex flex-row">
                    <div style={{ fontWeight: "bold", whiteSpace: "nowrap", width: "13em", overflow: "hidden", textOverflow: "ellipsis", marginRight: "2em" }}>
                      {enq.Listing.title}
                    </div>
                    <p className="card-text text-muted ms-auto" style={{ width: "4em" }}>
                      <small>{dayjs(enq.createdAt).format("MMM D")}</small>
                    </p>
                  </div>
                  {/**todo: fix elipsis on bigger screen */}
                  <p className="card-text" style={{ width: "300px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {/** TODO ADD USERNAME OR EMAIL OF MESSAGE SENDER HERE */}
                    <span className="strong-text">
                      {getConvoUser(enq)}
                      {":"}
                    </span>
                    {!disablePreview && lastMessage && lastMessage?.messageText}
                    {disablePreview && "Handled by TCI Homebase"}
                  </p>
                  {isAdmin && landlordManaged && <span className="text-danger">Managed by Landlord</span>}
                </div>
              </div>
            </div>
          );
        })}
        {/* Conversation List end */}
      </div>
      <div className="card col-md-7 col-lg-7 shadow-sm" style={{ height: "700px" }}>
        {!activeConversation && (
          <div className="mx-auto" style={{ marginTop: "250px" }}>
            <img src="/static/message.png" style={{ height: "169px", width: "190px" }}></img>
          </div>
        )}
        {activeConversation && (
          <div className="d-flex flex-column">
            <Chat onSend={sendMessage} textboxVal={chatTextbox} onChangeTextboxVal={setChatTextbox} />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div style={{ justifyContent: "center" }}>
      {" "}
      <div style={{ justifyContent: "center" }}>No Messages</div>
      <div style={{ justifyContent: "center" }}>
        <img src="/static/no-message.png"></img>
      </div>{" "}
    </div>
  );
};

export default connect()(MessageEnquiries);
