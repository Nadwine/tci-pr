import React from "react";
import { connect } from "react-redux";
import Message from "../../database/models/message";

export const Chat = props => {
  const chats: Message[] = [
    { user: "other", text: "Hi", createdAt: "10:40 AM" },
    { user: "me", text: "Whats up doc", createdAt: "10:40 AM" },
    { user: "me", text: "how are u?", createdAt: "10:40 AM" },
    { user: "other", text: "Im Ok, Just looking for the flat on road 365 and me an my friend is looking to move in on the", createdAt: "10:40 AM" },
    { user: "me", text: "Whats up doc", createdAt: "10:40 AM" },
    { user: "other", text: "Hi", createdAt: "10:40 AM" },
    { user: "other", text: "Hi", createdAt: "10:40 AM" },
  ];
  return (
    <div className="enquiry-message-wrapper">
      <div className="d-flex w-100 flex-column">
        <div className="d-flex chat-header" style={{ borderBottom: "1px solid grey" }}>Person Name Here</div>
        <div className="d-flex flex-column chat-area px-5 mx-5" style={{ height: "50vh", overflow: "scroll" }}>
          {chats.map((c, i) => (
            <div className="" key={i} style={{ marginLeft: c.user === "me" ? "auto" : "", marginBottom: "20px", }}>
              <div
                className="rounded-pill"
                style={{
                  padding: "2px 20px",
                  backgroundColor: c.user === "me" ? "#0082ff" : "#c1c1c1",
                  color: c.user === "me" ? "white" : "black",
                  width: "fit-content"
                }}
              >
                {c.text}
              </div>
              <div style={{ fontSize: "0.7em", marginLeft: "10px" }}>{c.createdAt}</div>
            </div>
          ))}
        </div>
        <div className="d-flex p-3 text-sender" style={{ position: "absolute", left: "10px", top: "70vh", height: "70px", border: "1px solid grey", width: "95vw", zIndex: +20, borderRadius: "10px" }}>
        <input className="form-control" type="text" placeholder="type new message" style={{ width: "85%" }} />
                <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default connect()(Chat);
