"use strict";
import express, { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../database/models/user";

import EnquiryConversation from "../../database/models/enquiry_conversation";
import { AccountTypeEnum, ReactRoutesEnum } from "../../../types/enums";
import { Op } from "sequelize";
import { ensureAuthentication, ensureLogout } from "../middlewareFunctions/auth-middleware";
import { registerRequestValidation } from "../../utils/validation-schemas/schema-register";
import { loginRequestValidation } from "../../utils/validation-schemas/schema-login";
import dayjs from "dayjs";
import Admin from "../../database/models/admin";
import ListingLandlord from "../../database/models/listing_landlord";
const router = express.Router();

export const getUserCredentials = async (req: Request, res: Response, next: NextFunction) => {
  return res.json(req.session.user || null);
};

export const refreshUserPermission = async (req: Request, res: Response) => {
  try {
    if (!req.session.user) {
      return res.json({ result: "success" });
    } else {
      const dbUser: User | null = await User.findByPk(req.session.user.id);

      // TODO compare difference and send back a updated version to client
      if (dbUser && dbUser.accountType) {
        req.session.user = {
          id: dbUser.id,
          username: dbUser.username || "",
          email: dbUser.email,
          allowed: [],
          accountType: dbUser.accountType || ""
        };
      }
      return res.json({ result: "success" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server failure", error: err });
  }
};

/*==================================================================**
 |
 |              POST          /auth/register
 |
 *===================================================================*/
export const registerUser = async (req: Request, res: Response) => {
  const isValidRequest = registerRequestValidation(req);
  if (!isValidRequest) {
    return res.redirect("/register/?error=invalid request");
  }
  const { email, password, username, registerReason }: { email: string; password: string; username: string; registerReason: string } = req.body;
  const isLandlord = registerReason === "landlord";

  // Check if Email is not already existing
  const matchedEmail = await User.findOne({
    where: { email: email.toLowerCase() }
  });

  if (matchedEmail) return res.redirect(`/register/?error=A user with email "${email}" already exist`);

  // Create hash password and save user
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const createdUserCallback: User | null = await User.create({
    username: username,
    email: email.toLowerCase(),
    password: hashedPassword,
    company: "",
    verified: false,
    accountType: registerReason === "landlord" ? "landlord" : "tenant"
  });

  // if (isLandlord && createdUserCallback) {
  //   await ListingLandlord.create({
  //     email: email,
  //     userId: createdUserCallback.id
  //   });
  // }

  const hashSecret = process.env.EMAIL_TOKEN_HASH_SECRET || "";
  // creating email token/url
  const emailToken = jwt.sign({ userEmail: createdUserCallback.email }, hashSecret, {
    expiresIn: "5h"
  });

  const emailLink = `${process.env.BASE_URL}/api/auth/register-confirm/${emailToken}`;
  const html = `<html>Please click this link to confirm your email <a href="${emailLink}">${emailLink}</a><html>`;

  // Send Verification Email
  const AWS = require("aws-sdk");
  const ses = new AWS.SES({
    region: process.env.AWS_SES_REGION,
    endpoint: process.env.AWS_SES_ENDPOINT,
    credentials: { accessKeyId: process.env.AWS_SES_KEY, secretAccessKey: process.env.AWS_SES_SECRET }
  });

  ses.sendEmail(
    {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Html: { Data: html },
          Text: { Data: html }
        },
        Subject: {
          Data: "Account Verification"
        }
      },
      Source: process.env.AWS_SES_EMAIL_ADDRESS
    },
    (emailFailedError, data) => {
      if (emailFailedError?.message) {
        console.log("Email Failed To Send Error", emailFailedError.message);
        return res.redirect(`/register-confirm?verification_sent=false&email=${email}`);
      } else {
        return res.redirect(`/register-confirm?verification_sent=true&email=${email}`);
      }
    }
  );
};

/*==================================================================**
 |
 |              GET          /auth/register-confirm /:token
 |
 *===================================================================*/
export const confirmUserAccountFromEmailToken = async (req, res) => {
  const { token } = req.params;
  if (!token || typeof token !== "string") {
    return res.redirect("/register?error=invalid request");
  }

  try {
    const hashSecret = process.env.EMAIL_TOKEN_HASH_SECRET || "";
    // @ts-ignore
    const { userEmail } = jwt.verify(token, hashSecret); // throws to catch if failed to verify
    const foundUser = await User.findOne({ where: { email: userEmail } });
    if (foundUser) {
      // and he is not already verified
      if (foundUser.verified === false) {
        await foundUser.update({ verified: true });
        // Success
        return res.redirect("/login?success=Verification successful");
      } else {
        // else if he is already verified
        return res.redirect("/login?error=Verification failed. User already verified");
      }
    } else {
      // Else if user not found
      return res.redirect("/register?error=Verification failed. Please complete registration");
    }
  } catch (error) {
    console.log(error);
    // res.status(400).json({ error: 'Invalid verification link -t' })
    return res.redirect(`/register-confirm?error=Verification failed ${error}`);
  }
};

export const changePasswordFromEmailToken = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!token || typeof token !== "string" || !password || typeof password !== "string") {
    return res.redirect("/login?error=invalid request");
  }

  try {
    const hashSecret = process.env.EMAIL_TOKEN_HASH_SECRET || "";
    // @ts-ignore
    const { userEmail } = jwt.verify(token, hashSecret); // throws to catch if failed to verify
    const foundUser = await User.findOne({ where: { email: userEmail } });
    if (foundUser) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      await foundUser.update({
        password: hashedPassword
      });
      return res.redirect("/forget-password?status=complete&message=success");
    } else {
      // Else if user not found
      return res.redirect("/register?error=Verification failed. Please complete registration");
    }
  } catch (error) {
    console.log(error);
    // res.status(400).json({ error: 'Invalid verification link -t' })
    return res.redirect(`/register-confirm?error=Verification failed ${error}`);
  }
};

/*==================================================================**
 |
 |           POST       /auth/resend-verification
 |
 *===================================================================*/
// TODO Rate Limiter To prevent Spam
export const resendVerificationToUserEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  if (!email || typeof email !== "string") {
    return res.redirect("/register?error=invalid request");
  }
  const hashSecret = process.env.EMAIL_TOKEN_HASH_SECRET || "";
  const emailToken = jwt.sign({ userEmail: email }, hashSecret, {
    expiresIn: "5h"
  });
  const emailLink = `${process.env.BASE_URL}/api/auth/register-confirm/${emailToken}`;
  const html = `<html>Please click this link to confirm your email <a href="${emailLink}">${emailLink}</a><html>`;

  const AWS = require("aws-sdk");
  const ses = new AWS.SES({
    region: process.env.AWS_SES_REGION,
    endpoint: process.env.AWS_SES_ENDPOINT,
    credentials: { accessKeyId: process.env.AWS_SES_KEY, secretAccessKey: process.env.AWS_SES_SECRET }
  });

  ses.sendEmail(
    {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Html: { Data: html },
          Text: { Data: html }
        },
        Subject: {
          Data: "Account Verification"
        }
      },
      Source: process.env.AWS_SES_EMAIL_ADDRESS
    },
    (emailFailedError, data) => {
      if (emailFailedError?.message) {
        console.log("Email Failed To Send Error", emailFailedError.message);
        return res.redirect(`/register-confirm?verification_sent=false&email=${email}`);
      } else {
        return res.redirect("/register-confirm?verification_sent=true");
      }
    }
  );
};

export const resendPasswordResetLinkToUserEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  if (!email || typeof email !== "string") {
    return res.redirect("/forget-password/null?message=invalid request");
  }
  const foundUser = await User.findOne({ where: { email: email } });
  if (!foundUser) return res.status(200).json({ message: "success" });

  const hashSecret = process.env.EMAIL_TOKEN_HASH_SECRET || "";
  const emailToken = jwt.sign({ userEmail: email }, hashSecret, {
    expiresIn: "5h"
  });
  const emailLink = `${process.env.BASE_URL}/forget-password/${emailToken}?status=sent`;
  const html = `<html>Please click this link to reset your password <a href="${emailLink}">${emailLink}</a><html>`;

  const AWS = require("aws-sdk");
  const ses = new AWS.SES({
    region: process.env.AWS_SES_REGION,
    endpoint: process.env.AWS_SES_ENDPOINT,
    credentials: { accessKeyId: process.env.AWS_SES_KEY, secretAccessKey: process.env.AWS_SES_SECRET }
  });

  ses.sendEmail(
    {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Html: { Data: html },
          Text: { Data: html }
        },
        Subject: {
          Data: "Password Reset"
        }
      },
      Source: process.env.AWS_SES_EMAIL_ADDRESS
    },
    (emailFailedError, data) => {
      if (emailFailedError?.message) {
        console.log("Email Failed To Send Error", emailFailedError.message);
        return res.redirect(`/forget-password/null?status=pending&message=error while sending email"`);
      } else {
        return res.redirect("/forget-password/null?status=pending&message=Email successfully sent");
      }
    }
  );
};

/*==================================================================**
 |
 |               POST         /auth/Login
 |
 *===================================================================*/
export const loginUser = async (req: Request, res: Response) => {
  const isValidRequest = loginRequestValidation(req);
  if (!isValidRequest) {
    return res.redirect("/login/?error=invalid request");
  }

  const { nameOrEmail, password } = req.body;
  try {
    const isUserLoggedIn = req?.session?.user ? true : false;
    if (isUserLoggedIn) {
      return res.redirect(`${req.session.returnTo || "/"}`);
    }

    // username or email match query
    const foundUser: User | null = await User.findOne({
      where: { email: nameOrEmail.toLowerCase() }
    });

    if (!foundUser) {
      console.log("Username not Found");
      return res.redirect("/login?error=Invalid Login");
    }

    if (foundUser.verified === false) {
      return res.redirect(`/register-confirm?email=${foundUser.email}`);
    }
    const thirtyDaysInMS = dayjs().add(30, "day").millisecond();
    const sixMonthsInMS = dayjs().add(6, "month").millisecond();
    const dBHashedPassword = foundUser.password;
    bcrypt.compare(password, dBHashedPassword, (err, result) => {
      if (result === true && foundUser.accountType !== undefined) {
        // create a session for user
        req.session.user = {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username || "",
          allowed: [],
          accountType: foundUser.accountType
        };
        // req.session.cookie.expires = dayjs(); // Expires sets an expiry date for when a cookie gets deleted;
        // req.session.cookie.maxAge = thirtyDays;   //  Max-age sets the time in seconds for when a cookie will be deleted
        console.log(`${foundUser.username} has signed in`);
        // Success redirect
        req.session.returnTo && delete req.session.returnTo;
        if (foundUser.accountType === "admin") {
          res.redirect("/admin/dashboard");
        } else {
          res.redirect(`${req.session.returnTo || "/"}`);
        }
      } else {
        // password comparision failed
        return res.redirect("/login?error=Invalid Login");
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).redirect(`/login?error=${error}"`);
  }
};

/*==================================================================**
 |
 |              GET          /auth/Logout
 |
 *===================================================================*/
export const logoutUser = (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const username = req.session.user?.username;
  req.session.destroy(() => console.log(`${username} has logged out`));
  return res.redirect("/");
};

export default router;
