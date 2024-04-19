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
  const [showResend, setShowResend] = useState(false);

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

  // TODO: check first if email exist then rate limit the re-send endpoint to avoid spam email
  return (
    <div>
      <h4 className="ms-2 ms-md-5 mt-5 text-success">
        <i className="bi bi-stars"></i>Almost there!
      </h4>
      <br />
      <h4 className="ms-md-5 ms-2">{"Let's"} confirm your email address</h4>
      <br />
      <div className="ms-2 ms-md-5">{renderSentMessage && `A link has been sent to your inbox, please verify your account ${""}`}</div>

      <div className="pt-2 mt-4 ms-md-5 ms-2">
        <br />
        Token not working? Enter email to resend
        <br />
        <div className="d-flex pt-3">
          <input
            type="text"
            className=" form-control"
            style={{ width: "15em", height: "3em" }}
            placeholder="example@mail.com"
            onChange={e => setEmailResender(e.target.value)}
          />
          <button onClick={() => requestNewVerifyLink()} className="btn btn-dark ms-3">
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect()(RegisterConfirm);
