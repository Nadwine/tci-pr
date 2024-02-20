import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import _ from "lodash";
import { ValidationError } from "yup";
import { passwordRegEx } from "../../utils/validation-schemas/schema-register";
import { toast } from "react-toastify";

const PwdError = "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character";

const passwordValidationSchema: yup.AnyObjectSchema = yup.object({
  password: yup.string().required("Please enter a password").matches(passwordRegEx, PwdError),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required()
});

const ForgetPassword = () => {
  // searching url for registration query param
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const forgetPasswordStatus = searchParams.get("status");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState(searchParams.get("message") || Object);
  const [touched, setTouched] = useState({});
  const [emailValid, setEmailValid] = useState<boolean | undefined>();

  const validateForm = (checkIfFieldWasTouched: boolean) => {
    const formData = {
      password: password,
      confirmPassword: confirmPassword
    };
    const newErrors = {};
    passwordValidationSchema.validate(formData, { abortEarly: false }).catch((errs: ValidationError) => {
      errs.inner.forEach((e: ValidationError) => {
        const field = e.path || "";
        const message = e.message;
        // console.log(errs.message);
        // if the field was interacted with
        if (checkIfFieldWasTouched) {
          if (touched[field]) {
            // add to newErrors.fieldName
            newErrors[field] = message;
          }
        } else {
          newErrors[field] = message;
        }
      });
      setErrors(newErrors);
    });
  };

  useEffect(() => {
    validateForm(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, password, confirmPassword]);

  const submitPasswordReset = async () => {
    await axios
      .post(`/api/auth/forget-password/${token}`, { password: password })
      .then(() => {
        // navigate
        toast.success("success");
        setPassword("");
        setConfirmPassword("");
        searchParams.set("status", "completed");
      })
      .catch(() => {
        toast.error("Sorry an error has occurred");
      });
  };

  const handlePasswordReset = async e => {
    e.preventDefault();
    const formData = {
      password: password,
      confirmPassword: confirmPassword
    };
    const isFormValid = await passwordValidationSchema.isValid(formData);

    if (isFormValid) {
      submitPasswordReset();
    } else {
      validateForm(false);
    }
  };

  const handleEmailSend = async e => {
    e.preventDefault();
    const isFormValid = await yup.string().email().isValid(email);
    setEmailValid(isFormValid);

    if (isFormValid) {
      const res = await axios.post("/api/auth/forget-password/send-email", { email: email });
      if (res.status === 200) {
        toast.success("Successfully sent");
      } else {
        toast.error("error while sending");
      }
    }
  };

  const renderSentMessage = true; // ForgetPasswordResult !== 'failed' || emailSubmitted === true

  // TODO: check first if email exist then rate limit the re-send endpoint to avoid spam email
  return (
    <div>
      {!forgetPasswordStatus && <div className="text-danger text-center">status query missing</div>}
      {forgetPasswordStatus === "pending" && (
        <div>
          <h2 className="mt-4">Please enter your email address</h2>
          <br /> A password reset link will been sent to your inbox
          <div className="pt-2 mt-4">
            <br />
            <div className="text-danger">
              {emailValid === false && "Not a valid email"}
              {typeof errors === "string" && errors}
              {typeof errors === "object" ? errors?.password || errors?.confirmPassword : ""}
            </div>
            <div className="d-flex pt-3">
              <form className="d-flex flex-lg-row" onSubmit={handleEmailSend}>
                <input
                  type="text"
                  className=" form-control"
                  style={{ width: "20em", height: "3em" }}
                  placeholder="Email"
                  onChange={e => setEmail(e.target.value)}
                />
                <button className="btn btn-dark fw-bold ms-3">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
      {forgetPasswordStatus === "sent" && (
        <div>
          <h3 className="fw-bold mt-4 my-4">Enter New Password</h3>
          <form onSubmit={handlePasswordReset}>
            <input
              type="password"
              name="password"
              value={password}
              className=" form-control"
              style={{ width: "20em", height: "3em", marginBottom: "2px" }}
              placeholder="New Password"
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              className=" form-control"
              style={{ width: "20em", height: "3em" }}
              placeholder="Confirm Password"
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button onClick={() => submitPasswordReset()} className="btn btn-dark fw-bold my-3">
              Send
            </button>
          </form>
        </div>
      )}
      {forgetPasswordStatus === "completed" && (
        <h4 className="text-success m-5">
          Your Password has now been changed! Click here to <a href="/login">Login</a>
        </h4>
      )}
    </div>
  );
};

export default connect()(ForgetPassword);
