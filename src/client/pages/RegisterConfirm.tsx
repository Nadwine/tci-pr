import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";

const RegisterConfirm = () => {
  // searching url for registration query param
  const [searchParams] = useSearchParams();
  const registerConfirmResult = searchParams.get("result");
  const [emailResender, setEmailResender] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  useEffect(() => {
    if (registerConfirmResult === "failed") {
      console.log("Verification failed");
    }
  });

  const requestNewVerifyLink = async () => {
    await axios
      .post("/api/auth/resend-verification", { email: emailResender })
      .then(() => {
        console.log("email Sent");
      })
      .catch(() => {
        console.log("Sorry an error has occured");
      });
  };

  const renderSentMessage = true; // registerConfirmResult !== 'failed' || emailSubmitted === true
  return (
    <div>
      <h2>Almost there!</h2>
      <br />
      <h2>{"Let's"} confirm your email address.</h2>
      <br />
      {renderSentMessage && `A link has been sent to your inbox please verify your account: ${""}`}

      <div>
        <br />
        Token not working? Enter email to resend
        <br />
        <div className="d-flex pt-3">
          <input
            type="text"
            className=" form-control"
            style={{ width: "20em", height: "3em" }}
            placeholder="email"
            onChange={e => setEmailResender(e.target.value)}
          />
          <button onClick={() => requestNewVerifyLink()} className="btn btn-primary ms-3">
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect()(RegisterConfirm);
