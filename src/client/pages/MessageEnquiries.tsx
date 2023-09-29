import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import EnquiryConversation from "../../database/models/enquiry_conversation";

const MessageEnquiries = props => {
  const [enquiries, setEnquiries] = useState<EnquiryConversation[]>([]);

  const loadData = async () => {
    const res = await axios.get("/api/enquiry/latest");
    if (res.status === 200) {
      console.log("Enquiryies", res.data);
      setEnquiries(res.data);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  return enquiries.length > 0 ? (
    <div className="row" style={{ height: "95px" }}>
      <hr style={{ color: "grey" }}></hr>
      <div className="col-12 d-flex justify-content-start me-5" style={{ height: "60px" }}>
        <div className="col-1 d-flex justify-content-end">
          <img src="/static/banner-img3.jpg" style={{ height: "40px", width: "40px", borderRadius: "5px" }} />
        </div>
        <div style={{ marginLeft: "25px" }}>
          <span style={{ fontWeight: "bold" }}>{enquiries[0].User.email}</span>
          <p style={{ float: "right" }}>
            <small>date here</small>
          </p>
          {/**todo: fix elipsis on bigger screen */}
          <p style={{ width: "400px", height: "80px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            This is where the messages will hnsch u8fwa8ufwau8 a8uwfhna8uwh u8awnhr auirwnairn auirw
          </p>
        </div>
      </div>
      <hr style={{ color: "grey" }}></hr>
    </div>
  ) : (
    <div> No Messages </div>
  );
};

export default connect()(MessageEnquiries);
