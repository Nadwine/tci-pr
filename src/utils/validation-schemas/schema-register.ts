import { Request } from "express";
import Joi from "joi";
import _ from "lodash";

// eslint-disable-next-line no-useless-escape
export const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const PwdError = "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character";

export const registerBodySchema = Joi.object({
  registerReason: Joi.string().required().messages({
    "string.empty": "Please select a registration reason"
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email",
      "string.empty": "Email is required"
    }),
  password: Joi.string().pattern(passwordRegEx).required().messages({
    "string.empty": "Please enter a password",
    "string.pattern.base": PwdError
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "string.empty": "Please enter a password"
  }),
  terms: Joi.boolean().valid(true).required().messages({
    "any.only": "Please accept the terms of registration",
    "boolean.base": "Missing terms"
  })
});

export const exampleRequestWithJoi = Joi.object({
  body: registerBodySchema,
  params: Joi.object({
    username: Joi.string()
  })
});

export const registerRequestValidation = (req: Request): boolean => {
  const { password, email, registerReason } = req.body;
  const emptyURLParams = _.isEmpty(req.params);
  const emptyQuery = _.isEmpty(req.query);

  if (
    email &&
    password &&
    registerReason &&
    typeof registerReason === "string" &&
    typeof email === "string" &&
    typeof password === "string" &&
    emptyURLParams &&
    emptyQuery
  ) {
    return true;
  } else {
    return false;
  }
};
