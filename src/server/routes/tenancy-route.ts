import { Request, Response, Express } from "express";
import Tenancy from "../../database/models/tenancy";
import PropertyForRent from "../../database/models/property_for_rent";
import ListingLandlord from "../../database/models/listing_landlord";
import Listing from "../../database/models/listing";
import Tenant from "../../database/models/tenant";
import TenancyDocument from "../../database/models/tenancy_document";
import _ from "lodash";
import User from "../../database/models/user";
import jwt from "jsonwebtoken";
import Profile from "../../database/models/profile";
import bcrypt from "bcrypt";

export const getSessionUserTenancies = async (req: Request, res: Response) => {
  try {
    const tenant = await Tenant.findOne({ where: { userId: req.session.user?.id } });
    if (!tenant) return res.json(null);

    const myOngoingTenancies = await Tenancy.findAll({
      where: { isHistory: false },
      include: [
        { model: Tenant, where: { id: tenant.id } },
        { model: PropertyForRent, include: [{ model: Listing, include: [{ model: ListingLandlord }] }] },
        { model: TenancyDocument }
      ]
    });
    const otherJointTenancies = await Tenancy.findAll({
      where: { propertyForRentId: myOngoingTenancies[0].PropertyForRent.id, isHistory: false },
      include: [{ model: Tenant }, { model: PropertyForRent, include: [{ model: Listing, include: [{ model: ListingLandlord }] }] }, { model: TenancyDocument }]
    });

    const combined = myOngoingTenancies.concat(otherJointTenancies.filter(other => !myOngoingTenancies.find(my => my.id === other.id)));
    return res.json(combined);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const getLandlordTenancies = async (req: Request, res: Response) => {
  try {
    const landlord = await ListingLandlord.findOne({ where: { userId: req.session.user?.id } });
    if (!landlord) return res.json(null);
    const listings = await Listing.findAll({ where: { landlordId: landlord.id }, include: [PropertyForRent] });
    const landLordProperyIds = listings.map(l => l.PropertyForRent.id);

    const tenancies = await Tenancy.findAll({ where: { propertyForRentId: landLordProperyIds, isHistory: false }, include: [Tenant] });
    return res.json(tenancies);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const getAllTenancies = async (req: Request, res: Response) => {
  if (req.session.user?.accountType !== "admin") {
    return res.status(401).json({ message: "Unauthorised" });
  }
  try {
    const tenancies = await Tenancy.findAll({ include: [PropertyForRent, Tenant] });
    return res.json(tenancies);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const getTenancyById = async (req: Request, res: Response) => {
  const tenancyId = req.params.id;
  try {
    const tenancies = await Tenancy.findByPk(tenancyId, { include: [PropertyForRent, Tenant] });
    return res.json(tenancies);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const createTenancyRoute = async (req: Request, res: Response) => {
  const { rentalAgreementDate, deposit, isDepositPaid, outstandingRent, isDepositReleased, tenancyStatus, tenantUserId, propertyForRentId, isPaymentTogether } =
    req.body;

  const allowed = req.session.user!.accountType === "admin" || req.session.user!.accountType === "landlord";

  if (!allowed) return res.status(401).json({ message: "Unauthorized" });

  try {
    // const tenancy = await Tenancy.create({
    //   rentalAgreementDate: rentalAgreementDate,
    //   deposit: deposit,
    //   isDepositPaid: isDepositPaid,
    //   outstandingRent: outstandingRent,
    //   isDepositReleased: isDepositReleased,
    //   propertyForRentId: propertyForRentId,
    //   userId: tenantUserId,
    //   tenancyStatus: tenancyStatus,
    //   leadTenantid: 0,
    //   isPaymentTogether: isPaymentTogether
    // });

    return res.status(200).json();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 711", err });
  }
};

export const sendInviteLinkToTenantEmail = async (req: Request, res: Response) => {
  const { email, propertyForRentId, firstName, lastName } = req.body;
  // TODO ENSURE PERSON OWNS RESOURCE
  try {
    const hashSecret = process.env.EMAIL_TOKEN_HASH_SECRET || "";
    const emailToken = jwt.sign({ email: email, propertyForRentId: propertyForRentId, firstName: firstName, lastName: lastName }, hashSecret, {
      expiresIn: "2d"
    });

    const emailLink = `${process.env.BASE_URL}/api/invite/accept-invitation?token=${emailToken}`;
    const html = `<html>You have been invited to join a tenancy. Please click the link to accept and join this tenancy <a href="${emailLink}">${emailLink}</a><html>`;

    // Send Invitation Email
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
            Data: "TCI Homebase - Invitation"
          }
        },
        Source: process.env.AWS_SES_EMAIL_ADDRESS
      },
      (emailFailedError, data) => {
        if (emailFailedError?.message) {
          console.log("Email Failed To Send Error", emailFailedError.message);
          return res.status(500).json({ message: "Failed" });
        } else {
          return res.status(200).json({ message: "Success" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 711", err });
  }
};

export const acceptInviteToTenancy = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) return res.redirect("/invite/accept?result=failed&message=Error, Invalid Request. Token not found");

  try {
    const hashSecret = process.env.EMAIL_TOKEN_HASH_SECRET || "";
    // @ts-ignore
    const { email, propertyForRentId, firstName, lastName } = jwt.verify(token, hashSecret); // throws to catch if failed to verify
    const property = await PropertyForRent.findByPk(propertyForRentId);
    if (!property) return res.redirect("/invite/accept?result=failed&message=Error, Invalid Request. Property not found");

    // Can be Null if first tenant ???????
    const existingTenancy = await Tenancy.findOne({ where: { propertyForRentId: property.id, isHistory: false } });
    const foundUser = await User.findOne({ where: { email: email }, include: [Profile] });

    if (foundUser?.accountType !== "tenant") return res.redirect("/invite/accept?result=failed&message=Error, Invalid Request. Invalid account type");

    let newUser: User;
    const newPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (!foundUser) {
      // Create User
      newUser = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        company: "",
        verified: true,
        termsAccepted: true,
        accountType: "tenant"
      });

      await Profile.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        userId: newUser.id
      });
    }

    // If user exists but did not fill in his profile section
    if (foundUser && !foundUser.Profile) {
      await Profile.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        userId: foundUser.id
      });
    }

    property.update({ numOfTenants: property.numOfTenants + 1 });
    const tenant = await Tenant.create({
      firstName: foundUser?.Profile?.firstName || firstName,
      lastName: foundUser?.Profile?.lastName || lastName,
      email: email,
      propertyForRentId: property.id,
      tenancyStatus: "generating-documents",
      isLeadTenant: true,
      userId: foundUser?.id || newUser!.id || 0
    });

    const tenancy = await Tenancy.create({
      isHistory: false,
      firstName: foundUser?.Profile?.firstName || firstName,
      lastName: foundUser?.Profile?.lastName || lastName,
      mainContactEmail: email,
      propertyForRentId: property.id,
      tenancyStatus: "generating-documents",
      leadTenantid: tenant.id,
      isPaymentTogether: false,
      userId: foundUser?.id || newUser!.id || 0,
      rentalAgreementDate: existingTenancy?.rentalAgreementDate,
      lenghtInDays: existingTenancy?.lenghtInDays
    });

    await tenant.update({ tenancyId: tenancy.id });

    if (foundUser) {
      return res.redirect("/my-tenancy");
    } else {
      // new user created email credentials
      const html = `<html>Your TCI Homebase login details. Email: ${email} Password: ${newPassword}<html>`;

      // Send Invitation Email
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
              Data: "TCI Homebase - Login"
            }
          },
          Source: process.env.AWS_SES_EMAIL_ADDRESS
        },
        (emailFailedError, data) => {
          if (emailFailedError?.message) {
            console.log("Email Failed To Send Error", emailFailedError.message);
          } else {
            // success
          }
        }
      );
      return res.redirect(
        "/invite/accept?result=success&message=Invitation Accepted. Your login details has been sent to your email address. Please login and set your preferred password"
      );
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 711", err });
  }
};
