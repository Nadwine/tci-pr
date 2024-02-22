// import { Request, Response, Express } from "express";
// import AWS, { AWSError } from "aws-sdk";
// import sharp from "sharp";
// import S3 from "aws-sdk/clients/s3";
// import Listing from "../../database/models/listing";
// import Admin from "../../database/models/admin";
// import PropertyForRent from "../../database/models/property_for_rent";
// import Address from "../../database/models/address";
// import { ListingTypeEnum } from "../../../types/enums";
// import ListingMedia from "../../database/models/listing_media";
// import { InferAttributes, Op, WhereOptions, where } from "sequelize";
// import PropertyForSale from "../../database/models/property_for_sale";
// import User from "../../database/models/user";
// import ListingQuestion from "../../database/models/listing_question";
// import EnquiryConversation from "../../database/models/enquiry_conversation";
// import { current } from "@reduxjs/toolkit";
// import ListingLandlord from "../../database/models/listing_landlord";
// import { createListingRouteSchema, createListingSchema } from "../../utils/validation-schemas/schema-listings";
// import ListingSaved from "../../database/models/listing_saved";
// import { TenantAndProperty } from "../../client/pages/admin/AdminTenantAndProperty";

// export const createTenancyRoute = async (req: Request, res: Response) => {
//   const {
//    rentalAgreementDate,
//    deposit,
//    isDepositPaid,
//   outstandingRent,
//   isDepositReleased,
//   tenancyStatus,
//   } = req.body;

//   if (req.session.user!.accountType !== "admin") return res.status(401).json({ message: "Unauthorized" });

//   let userId: number | null = null;
//   let propertyForRentId: number | null = null;

//   try {
//     await TenantAndProperty.create({
//         rentalAgreementDate: rentalAgreementDate,
//         deposit: deposit,
//         isDepositPaid: isDepositPaid,
//        outstandingRent: outstandingRent,
//        isDepositReleased: isDepositReleased,
//        propertyForRentId: propertyForRentId,
//        userId: userId,
//        propertyForRentId: propertyForRentId,
//        tenancyStatus: tenancyStatus,
//     });

//     return res.status(200).json({ message: "Successful tenancy" });
//   } catch (err) {
//     return res.status(500).json({ message: "Internal Server error 711", err });
//   }
// };

// export const updateTenById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { firstName, lastName, email, phoneNumber } = req.body;
//   const { addressLine1, addressLine2, settlement, city, postcode, country } = req.body;

//   try {
//     const relatedProfile = await Profile.findByPk(id, { include: [Address, User] });

//     if (!relatedProfile) return res.status(404).json({ message: "Not found" });
//     // Auth
//     if (relatedProfile?.userId !== req.session.user?.id) {
//       if (req.session.user?.accountType !== "admin") return res.status(401).json({ message: "unauthorized" });
//     }

//     await relatedProfile.update({
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       phoneNumber: phoneNumber,
//       addressLine1: addressLine1,
//       addressLine2: addressLine2,
//       settlement: settlement,
//       city: city,
//       postcode: postcode,
//       country: country
//     });

//     res.status(200).json({ message: "Success" });
//   } catch (err) {
//     res.status(500).json({ message: "Internal Server error 301", err });
//   }
// };

// export const deleteRentUserById = async (req: Request, res: Response) => {
//   const profileId = Number(req.params.id);

//   //FIX THIS PART
//   //   try {
//   //     const profile = await Profile.findByPk(profileId, { include: [Address] });
//   //     if (!profile && profile!.Admin.userId !== userId) {
//   //       return res.status(410).json({ message: "unauthorized" });
//   //     }

//   //     await Listing.destroy({ where: { id: listingId }, cascade: true });

//   //     return res.status(200).json({ message: "Success" });
//   //   } catch (err) {
//   //     return res.status(500).json({ message: "Internal Server error", err });
//   //   }
// };

// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await User.findAll();
//     return res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Internal Server error 301", err });
//   }
// };
