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
        enquiries.map((enq, i) => (
          <div onClick={() => dispatch(setActiveConversation(enq))} key={i} className="row" style={{ height: "95px" }}>
            <hr style={{ color: "grey" }}></hr>
            <div className="col-12 d-flex justify-content-start me-5" style={{ height: "60px" }}>
              <div className="col-1 d-flex justify-content-end">
                <img src="/static/banner-img3.jpg" style={{ height: "40px", width: "40px", borderRadius: "5px" }} />
              </div>
              <div style={{ marginLeft: "25px" }}>
                <span style={{ fontWeight: "bold" }}>{enq.Listing.title}</span>
                <p style={{ float: "right" }}>
                  <small>date here</small>
                </p>
                {/**todo: fix elipsis on bigger screen */}
                <p style={{ width: "400px", height: "80px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{enq.intro_message}</p>
              </div>
            </div>
            <hr style={{ color: "grey" }}></hr>
          </div>
        ))}
      {/* Conversation List end */}
      {activeConversation && (
        <div className="d-flex flex-column">
          {" "}
          <button className="btn btn-secondary mb-4" style={{ width: "2em" }} onClick={() => dispatch(setActiveConversation(null))}>
            {"<"}
          </button>
          <Chat onSend={sendMessage} textboxVal={chatTextbox} onChangeTextboxVal={setChatTextbox} />
        </div>
      )}
    </div>
  ) : (
    <div> No Messages </div>
  );
};

export default connect()(MessageEnquiries);
