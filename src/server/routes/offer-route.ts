import { Request, Response } from "express";
import Offer from "../../database/models/offer";
import Profile from "../../database/models/profile";
import ListingLandlord from "../../database/models/listing_landlord";
import Listing from "../../database/models/listing";
import PropertyTenant from "../../database/models/tenant_property";
import User from "../../database/models/user";
import PropertyForRent from "../../database/models/property_for_rent";

export const sendOffer = async (req: Request, res: Response) => {
  const sessionUsr = req.session.user;
  const userId = sessionUsr!.id;
  const { amount, tenancyLengthDays, preferredStartDate, listingId } = req.body;

  if (!amount || !tenancyLengthDays || !preferredStartDate || !listingId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    if (sessionUsr?.accountType !== "tenant") {
      return res.status(401).json({ message: "Unauthorized account type" });
    }

    const profile = await Profile.findOne({ where: { userId: userId } });
    if (!profile) return res.status(400).json({ message: "Profile Incomplete. Taking you to profile page..." });

    const foundOffer = await Offer.findOne({ where: { listingId: listingId, userId: userId } });
    if (foundOffer) return res.status(400).json({ message: "Offer has already been sent" });

    const offer = await Offer.create({
      userId: userId,
      listingId: listingId,
      amount: amount,
      tenancyLengthDays: tenancyLengthDays,
      preferredStartDate: preferredStartDate,
      status: "pending"
    });

    return res.status(200).json({ message: "success", offer: offer });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", err });
  }
};

export const acceptOrDeclineOffer = async (req: Request, res: Response) => {
  const sessUsr = req.session.user;
  const { offerId, status, listingId } = req.body;
  try {
    if (sessUsr!.accountType !== "admin" && sessUsr!.accountType !== "landlord") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // check if landlord owns the property
    if (sessUsr?.accountType === "landlord") {
      const landlord = await ListingLandlord.findOne({
        where: { userId: sessUsr?.id },
        include: [{ model: Listing, where: { id: listingId }, include: [Offer] }]
      });
      const relatedListing = landlord?.Listings[0];
      if (!landlord || relatedListing?.landlordId !== landlord.id) return res.status(401).json({ message: "Unauthorized" });
    }

    // now all above autorizations checks passed

    if (status === "accepted") {
      // now lets auto decline all other offers for that particular listing
      await Offer.update(
        {
          status: "declined"
        },
        { where: { listingId: listingId } }
      );
      // accept the one he/she selected
      const offerToAccept = await Offer.findByPk(offerId, {
        include: [
          { model: User, include: [Profile] },
          { model: Listing, include: [PropertyForRent] }
        ]
      });
      const offerUser = offerToAccept?.User;
      const userProfile = offerUser?.Profile;
      const offerListing = offerToAccept?.Listing;
      const offerPropertyForRent = offerListing?.PropertyForRent;
      if (!offerUser || !offerToAccept || !offerListing || !offerPropertyForRent) return res.status(500);
      offerToAccept?.update({ status: "accepted" });

      // Intiate Tenancy
      await PropertyTenant.create({
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
        email: offerUser?.email,
        phoneNumber: userProfile?.phoneNumber,
        addressString: userProfile?.addressLine1 || "" + userProfile?.addressLine2 || "" + userProfile?.settlement || "" + userProfile?.city || "",
        propertyForRentId: offerPropertyForRent.id,
        tenancyStatus: "ongoing",
        isLeadTenant: true,
        userId: offerUser.id || 0
      });
    }

    if (status === "declined") {
      await Offer.update(
        {
          status: "declined"
        },
        { where: { id: offerId } }
      );
    }

    return res.json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};
