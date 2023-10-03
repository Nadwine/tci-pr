import React from "react";
import { connect, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type Props = {
  onSend: (text: string) => void;
  textboxVal: string;
  onChangeTextboxVal: (val: string) => void;
};

export const Chat = (props: Props) => {
  const { textboxVal, onChangeTextboxVal, onSend } = props;
  const loggedInUserId = useSelector((r: RootState) => r.auth.user?.id);
  const chats = useSelector((r: RootState) => r.message.activeConversation?.Messages) || [];

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTextboxVal(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      textboxVal && onSend(textboxVal);
    }
  };

  return (
    <div className="enquiry-message-wrapper">
      <div className="d-flex w-100 flex-column">
        <div className="d-flex chat-header py-3" style={{ borderBottom: "1px solid grey", borderTop: "1px solid grey", marginBottom: "10px" }}>
          <strong>{chats[0]?.EnquiryConversation.Listing.title}</strong>
        </div>
        <div className="d-flex flex-column chat-area px-5 mx-5" style={{ height: "50vh", overflow: "scroll" }}>
          {chats.map((msg, i) => (
            <div className="" key={i} style={{ marginLeft: msg.userId === loggedInUserId ? "auto" : "", marginBottom: "20px" }}>
              <div
                className="rounded-pill"
                style={{
                  padding: "2px 20px",
                  backgroundColor: msg.userId === loggedInUserId ? "#0082ff" : "#c1c1c1",
                  color: msg.userId === loggedInUserId ? "white" : "black",
                  width: "fit-content"
                }}
              >
                {msg.messageText}
              </div>
              <div style={{ fontSize: "0.7em", marginLeft: "10px" }}>{dayjs(msg.createdAt).fromNow()}</div>
            </div>
          ))}
        </div>
        <div
          className="d-flex p-3 text-sender"
          style={{
            position: "absolute",
            left: "10px",
            top: "70vh",
            height: "70px",
            border: "1px solid grey",
            width: "95vw",
            zIndex: +20,
            borderRadius: "10px"
          }}
        >
          <input
            onKeyUp={handleKeyPress}
            onChange={onChangeText}
            value={textboxVal}
            className="form-control"
            type="text"
            placeholder="type new message"
            style={{ width: "95%" }}
          />
          <button disabled={!textboxVal} onClick={() => textboxVal && onSend(textboxVal)} className="btn btn-primary ms-4">
            <i className="bi bi-send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect()(Chat);
