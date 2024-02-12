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
import DesktopMessageEnquires from "./DesktopMessageEnquires";

const MessageEnquiries = props => {
  const dispatch = useDispatch();
  const enquiries = useSelector((root: RootState) => root.message.conversations);
  const activeConversation = useSelector((root: RootState) => root.message.activeConversation);
  const userId = useSelector((root: RootState) => root.auth.user!.id);
  const [chatTextbox, setChatTextbox] = useState("");

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
          <h3 className="px-4 mt-4 ps-1 fw-bolder">Your Enquiries</h3>
          <hr className="text-secondary"></hr>
          {/* Conversation List start */}
          {!activeConversation &&
            enquiries.map((enq, i) => {
              const lastMessage = enq.Messages[enq.Messages.length - 1];
              const hasUnreadMessages = enq.Messages.filter(m => m.userId !== userId && m.seenAt == null).length > 0;
              return (
                <div onClick={() => onClickCovo(enq)} key={i} className="row" style={{ height: "95px" }}>
                  <div
                    className="col-10 d-flex justify-content-start me-5 ms-2 mt-2 mb-2 point"
                    style={{ height: "60px", color: hasUnreadMessages ? "black" : "grey" }}
                  >
                    <div className="col-1 d-flex justify-content-end">
                      <img src={enq.Listing.ListingMedia[0]?.mediaUrl} style={{ height: "40px", width: "40px", borderRadius: "5px" }} />
                    </div>
                    <div style={{ marginLeft: "25px", width: "100%" }} className=" pe-1 pe-md-5 pe-lg-5">
                      <span style={{ fontWeight: "bold" }}>{enq.Listing.title}</span>
                      <p className="pe-sm-2" style={{ float: "right" }}>
                        <small>{dayjs(enq.createdAt).format("MMM D")}</small>
                      </p>
                      {/**todo: fix elipsis on bigger screen */}
                      <p style={{ width: "300px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{lastMessage?.messageText}</p>
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
