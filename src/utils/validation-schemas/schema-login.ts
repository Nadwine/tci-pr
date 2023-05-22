import { Request } from "express";
import _ from "lodash";

export const loginRequestValidation = (req: Request): boolean => {
  // only grab wanted keys
  const { nameOrEmail, password } = req.body;
  // ensure url params is empty we are not expecting anything to be passed
  const emptyURLParams = _.isEmpty(req.params);

  if (nameOrEmail && password && typeof nameOrEmail === "string" && typeof password === "string" && emptyURLParams) {
    return true;
  } else {
    return false;
  }
};
