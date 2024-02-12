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
    <div className="d-flex flex-wrap">
      <div
        className="card p-0 col-md-4 col-lg-3 ms-5 shadow-sm"
        style={{ overflow: "scroll", height: "700px", marginTop: "120px", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}
      >
        {/* Conversation List start */}
        {enquiries.map((enq, i) => {
          const lastMessage = enq.Messages[enq.Messages.length - 1];
          return (
            <div className="p-0" onClick={() => dispatch(setActiveConversation(enq))} key={i}>
              {/* <hr style={{ color: "grey" }}></hr> */}

              <div className="card-body border-bottom col-12 d-flex justify-content-start point">
                <div className="card-title col-1 d-flex justify-content-end">
                  <img src={enq.Listing.ListingMedia.find(m => m.label === "1")?.mediaUrl} style={{ height: "30px", width: "40px" }} />
                </div>
                <div style={{ marginLeft: "10px", width: "100%" }} className="card-title pe-1">
                  <div className="d-flex flex-row">
                    <div style={{ fontWeight: "bold", whiteSpace: "nowrap", width: "13em", overflow: "hidden", textOverflow: "ellipsis", marginRight: "2em" }}>
                      {enq.Listing.title}
                    </div>
                    <p className="card-text text-muted" style={{ width: "4em" }}>
                      <small>{dayjs(enq.createdAt).format("MMM D")}</small>
                    </p>
                  </div>
                  {/**todo: fix elipsis on bigger screen */}
                  <p className="card-text" style={{ width: "400px", overflow: "scroll", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {lastMessage?.messageText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {/* Conversation List end */}
      </div>
      <div
        className="card col-md-8 col-lg-8 shadow-sm"
        style={{ height: "700px", marginTop: "120px", borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}
      >
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
