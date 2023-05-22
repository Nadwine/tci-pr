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
        <input type="text" placeholder="email" onChange={e => setEmailResender(e.target.value)} />
        <button onClick={() => requestNewVerifyLink()}>Resend</button>
      </div>
    </div>
  );
};

export default connect()(RegisterConfirm);
