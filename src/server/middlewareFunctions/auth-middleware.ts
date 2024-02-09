// @ts-nocheck
import { NextFunction, Request, Response } from "express";

export const ensureAuthentication = (req: Request, res: Response, next: NextFunction) => {
  // id user session exists - Carry on
  if (req.session.user?.id) {
    return next();
  }

  // else tell react to redirect to login
  const returnTo: string = req.headers["currentbrowserpath"] || req.headers["x-currentbrowserpath"]; // req.originalUrl;

  if (returnTo !== "/" || returnTo !== "/register-confirm" || returnTo !== "/register" || returnTo !== "/login") {
    req.session.returnTo = returnTo;
  }
  return res.status(302).json({ redirect: "/login?error=please login to complete operation", error: "Login to complete operation" });
};

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  // id user session exists - Carry on
  if (req.session.user?.id && req.session.user.accountType === "admin") {
    return next();
  }

  // else tell react to redirect to login
  const returnTo: string = req.headers["currentbrowserpath"] || req.headers["x-currentbrowserpath"]; // req.originalUrl;

  if (returnTo !== "/" || returnTo !== "/register-confirm" || returnTo !== "/register" || returnTo !== "/login") {
    req.session.returnTo = returnTo;
  }
  return res.status(302).json({ redirect: "/login?error=please login to complete operation", error: "Login to complete operation" });
};

export const ensureLogout = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return next();
  }

  return res.redirect("/");
};
