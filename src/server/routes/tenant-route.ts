import { Request, Response, Express } from "express";
import PropertyTenant from "../../database/models/tenant_property";
import PropertyForRent from "../../database/models/property_for_rent";
import Address from "../../database/models/address";
import ListingLandlord from "../../database/models/listing_landlord";
import Offer from "../../database/models/offer";
import User from "../../database/models/user";
import Profile from "../../database/models/profile";
import ListingMedia from "../../database/models/listing_media";
import Admin from "../../database/models/admin";
import EnquiryConversation from "../../database/models/enquiry_conversation";
import ListingQuestion from "../../database/models/listing_question";
import Listing from "../../database/models/listing";

export const createTenancyRoute = async (req: Request, res: Response) => {
  const { rentalAgreementDate, deposit, isDepositPaid, outstandingRent, isDepositReleased, tenancyStatus, tenantUserId, propertyForRentId, isLeadTenant } =
    req.body;

  const allowed = req.session.user!.accountType === "admin" || req.session.user!.accountType === "landlord";

  if (!allowed) return res.status(401).json({ message: "Unauthorized" });

  try {
    const tenancy = await PropertyTenant.create({
      rentalAgreementDate: rentalAgreementDate,
      deposit: deposit,
      isDepositPaid: isDepositPaid,
      outstandingRent: outstandingRent,
      isDepositReleased: isDepositReleased,
      propertyForRentId: propertyForRentId,
      userId: tenantUserId,
      tenancyStatus: tenancyStatus,
      isLeadTenant: isLeadTenant
    });

    return res.status(200).json(tenancy);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 711", err });
  }
};

export const getTenantById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const tenancy = await PropertyTenant.findByPk(id, {
      include: [{ model: User }]
    });

    return res.status(200).json(tenancy);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

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

export const adminGetAllTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await PropertyTenant.findAll({
      include: [
        {
          model: PropertyForRent,
          include: [
            {
              model: Listing,
              include: [
                { model: Address },
                { model: ListingLandlord },
                { model: ListingMedia, order: [["id", "ASC"]] },
                { model: Admin, include: [User] },
                { model: ListingQuestion },
                // { model: EnquiryConversation, include: [{ model: Listing, include: [{ model: Offer }, { model: ListingMedia }] }] },
                { model: Offer, include: [{ model: User, include: [Profile] }] }
              ]
            }
          ]
        }
      ]
    });
    return res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: "Internal Server error 301", err });
  }
};
