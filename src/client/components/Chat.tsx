import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { setActiveConversation } from "../redux/reducers/messagesReducer";
dayjs.extend(relativeTime);

type Props = {
  onSend: (text: string) => void;
  textboxVal: string;
  onChangeTextboxVal: (val: string) => void;
};

export const Chat = (props: Props) => {
  const dispatch = useDispatch();
  const { textboxVal, onChangeTextboxVal, onSend } = props;
  const loggedInUserId = useSelector((r: RootState) => r.auth.user?.id);
  const chats = useSelector((r: RootState) => r.message.activeConversation?.Messages) || [];
  const listing = useSelector((r: RootState) => r.message.activeConversation?.Listing);
  const activeConvoTitle = useSelector((r: RootState) => r.message.activeConversation?.Listing.title);

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTextboxVal(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      textboxVal && onSend(textboxVal);
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
          <button className="btn-close ms-auto" onClick={() => dispatch(setActiveConversation(null))}></button>
        </div>
        <div className="d-flex flex-column col-12 col-md-10 chat-area" style={{ paddingBottom: "60px", height: "50vh", overflow: "scroll" }}>
          {chats.map((msg, i) => (
            <div className="" key={i} style={{ marginLeft: msg.userId === loggedInUserId ? "auto" : "", marginBottom: "20px" }}>
              <div
                className="text-center"
                style={{
                  borderRadius: "12px",
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
          className="d-flex text-sender py-3 px-md-5 px-lg-5 w-100"
          style={{
            position: "absolute",
            left: "10px",
            top: "73vh",
            height: "80px",
            zIndex: +20
          }}
        >
          <input
            onKeyUp={handleKeyPress}
            onChange={onChangeText}
            value={textboxVal}
            className="form-control"
            type="text"
            placeholder="Type new message"
            style={{ width: "95%", borderRadius: "15px" }}
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
