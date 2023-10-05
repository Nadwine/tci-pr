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

const MessageEnquiries = props => {
  const dispatch = useDispatch();
  const enquiries = useSelector((root: RootState) => root.message.conversations);
  const activeConversation = useSelector((root: RootState) => root.message.activeConversation);
  const userId = useSelector((root: RootState) => root.auth.user!.id);
  const [chatTextbox, setChatTextbox] = useState("");

  const loadData = async () => {
    const res = await axios.get("/api/enquiry/latest");
    if (res.status === 200) {
      console.log("Enquiryies", res.data);
      dispatch(setConversations(res.data));
    }
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

  const changeActiveConversation = () => {};

  useEffect(() => {
    loadData();
  }, []);

  return enquiries.length > 0 ? (
    <div className="message-view-wrapper">
      {/* Conversation List start */}
      {!activeConversation &&
        enquiries.map((enq, i) => {
          const lastMessage = enq.Messages[enq.Messages.length - 1];
          return (
            <div onClick={() => dispatch(setActiveConversation(enq))} key={i} className="row" style={{ height: "95px" }}>
              <hr style={{ color: "grey" }}></hr>
              <div className="col-12 d-flex justify-content-start me-5 mb-2 point" style={{ height: "60px" }}>
                <div className="col-1 d-flex justify-content-end">
                  <img src={enq.Listing.ListingMedia.find(m => m.label === "1")?.mediaUrl} style={{ height: "40px", width: "40px", borderRadius: "5px" }} />
                </div>
                <div style={{ marginLeft: "25px", width: "100%" }} className=" pe-1 pe-md-5 pe-lg-5">
                  <span style={{ fontWeight: "bold" }}>{enq.Listing.title}</span>
                  <p style={{ float: "right" }}>
                    <small>{dayjs(enq.createdAt).format("MMM D")}</small>
                  </p>
                  {/**todo: fix elipsis on bigger screen */}
                  <p style={{ width: "400px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{lastMessage.messageText}</p>
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
  ) : (
    <div> No Messages </div>
  );
};

export default connect()(MessageEnquiries);
