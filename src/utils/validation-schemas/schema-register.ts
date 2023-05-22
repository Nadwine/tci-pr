import { Request } from "express";
import * as yup from "yup";
import _ from "lodash";

// eslint-disable-next-line no-useless-escape
const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const PwdError = "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character";

export const registerBodySchema: yup.AnyObjectSchema = yup.object({
  username: yup.string().min(4, "Username Min 4 characters").required("Username is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().required("Please enter a password").matches(passwordRegEx, PwdError),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
  terms: yup.boolean().isTrue("Please accept the terms of registration").required("Missing terms")
});

const exampleRequestWithYup = yup.object({
  body: registerBodySchema,
  params: yup.object({
    username: yup.string()
  })
});

export const registerRequestValidation = (req: Request): boolean => {
  // only grab wanted keys
  const { username, password, email } = req.body;
  // ensure url params is empty we are not expecting anything to be passed
  const emptyURLParams = _.isEmpty(req.params);

  if (
    username &&
    email &&
    password &&
    typeof username === "string" &&
    typeof email === "string" &&
    typeof password === "string" &&
    emptyURLParams
  ) {
    return true;
  } else {
    return false;
  }
};
