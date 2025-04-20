import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Joi from "joi";
import _ from "lodash";
import { toast } from "react-toastify";

const PwdError = "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character";

const passwordValidationSchema = Joi.object({
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      "string.empty": "Please enter a password",
      "string.pattern.base": PwdError
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "string.empty": "Confirm Password is required"
  })
});

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const forgetPasswordStatus = searchParams.get("status");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors]: any = useState(searchParams.get("message") || {});
  const [touched, setTouched] = useState({});
  const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);

  const validateForm = (checkIfFieldWasTouched: boolean) => {
    const formData = {
      password,
      confirmPassword
    };
    const newErrors = {};
    const { error } = passwordValidationSchema.validate(formData, { abortEarly: false });

    if (error) {
      error.details.forEach(err => {
        const field = err.path[0];
        const message = err.message;
        if (checkIfFieldWasTouched) {
          if (touched[field]) {
            newErrors[field] = message;
          }
        } else {
          newErrors[field] = message;
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateForm(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, password, confirmPassword]);

  const submitPasswordReset = async () => {
    await axios
      .post(`/api/auth/forget-password/${token}`, { password })
      .then(() => {
        toast.success("success");
        setPassword("");
        setConfirmPassword("");
        searchParams.set("status", "completed");
      })
      .catch(() => {
        toast.error("Sorry an error has occurred");
      });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      password,
      confirmPassword
    };
    const { error } = passwordValidationSchema.validate(formData);
    const isFormValid = !error;

    if (isFormValid) {
      submitPasswordReset();
    } else {
      validateForm(false);
    }
  };

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailSchema = Joi.string().email({ tlds: { allow: false } });
    const { error } = emailSchema.validate(email);
    const isFormValid = !error;
    setEmailValid(isFormValid);

    if (isFormValid) {
      const res = await axios.post("/api/auth/forget-password/send-email", { email });
      if (res.status === 200) {
        toast.success("Successfully sent");
      } else {
        toast.error("error while sending");
      }
    }
  };

  const renderSentMessage = true;

  return (
    <div>
      {!forgetPasswordStatus && <div className="text-danger text-center">status query missing</div>}
      {forgetPasswordStatus === "pending" && (
        <div>
          <h2 className="mt-4">Please enter your email address</h2>
          <br /> A password reset link will be sent to your inbox
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
                  style={{ minWidth: "15em", height: "3em" }}
                  placeholder="Email"
                  onChange={e => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-dark fw-bold ms-3">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {forgetPasswordStatus === "sent" && (
        <div>
          <div className="text-danger pt-5">{typeof errors === "object" ? errors?.password || errors?.confirmPassword : ""}</div>
          <h3 className="fw-bold mt-4 my-4">Enter New Password</h3>
          <form onSubmit={handlePasswordReset}>
            <input
              type="password"
              name="password"
              value={password}
              className=" form-control"
              style={{ width: "15em", height: "3em", marginBottom: "2px" }}
              placeholder="New Password"
              onChange={e => setPassword(e.target.value)}
              onBlur={() => setTouched({ ...touched, password: true })}
            />
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              className=" form-control"
              style={{ width: "15em", height: "3em" }}
              placeholder="Confirm Password"
              onChange={e => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched({ ...touched, confirmPassword: true })}
            />
            <button type="submit" className="btn btn-dark fw-bold my-3">
              Confirm
            </button>
          </form>
        </div>
      )}
      {forgetPasswordStatus === "completed" && (
        <h4 className="text-success m-5">
          Your Password has now been changed! Click here to{" "}
          <button className="btn text-primary" onClick={() => navigate("/login")}>
            Login
          </button>
        </h4>
      )}
    </div>
  );
};

export default connect()(ForgetPassword);
