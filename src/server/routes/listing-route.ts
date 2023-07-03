import { Request, Response } from "express";
import Listing from "../../database/models/listing";
import Landlord from "../../database/models/landlord";
import PropertyForRent from "../../database/models/property_for_rent";
import Address from "../../database/models/address";
import { ListingTypeEnum } from "../../../types/enums";

export const createRentListingRoute = async (req: Request, res: Response) => {
  const {
    title,
    description,
    listingType,
    numOfRooms,
    numOfBathRooms,
    maxTenant,
    sqFt,
    billsIncluded,
    availability,
    addressLine1,
    addressLine2,
    settlement,
    city,
    postcode,
    country,
    rentAmount
  } = req.body;

  if (req.session.user?.accountType !== "landlord") return res.status(401).json({ message: "Unauthorized" });
  try {
    const landlord = await Landlord.findOne({ where: { userId: req.session.user?.id } });

    if (landlord) {
      const newListing = await Listing.create({
        title: title,
        description: description,
        listingType: ListingTypeEnum.RENT,
        landlordId: landlord!.id
      });

      await Address.create({
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        settlement: settlement,
        city: city,
        postcode: postcode,
        country: country,
        listingId: newListing!.id
      });

      await PropertyForRent.create({
        numOfRooms: numOfRooms,
        numOfBathRooms: numOfBathRooms,
        maxTenant: maxTenant,
        sqFt: sqFt,
        billsIncluded: billsIncluded,
        availability: availability,
        listingId: newListing.id,
        rentAmount: rentAmount
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};
