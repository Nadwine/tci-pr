import { Request, Response } from "express";
import Profile from "../../database/models/profile";
import Address from "../../database/models/address";
import User from "../../database/models/user";
import ListingLandlord from "../../database/models/listing_landlord";

export const createSessionUserProfileRoute = async (req: Request, res: Response) => {
  const userId = req.session.user!.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const { addressLine1, addressLine2, city, postcode, country, settlement } = req.body;
  const phoneNumber = req.body.phoneNumber;

  try {
    await Profile.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      settlement: settlement,
      city: city,
      postcode: postcode,
      country: country,
      userId: userId
    });

    return res.status(200).json({ message: "Successful profile" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 201", err });
  }
};

export const updateUserProfileById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber } = req.body;
  const { addressLine1, addressLine2, settlement, city, postcode, country } = req.body;

  try {
    const relatedProfile = await Profile.findByPk(id, { include: [Address, User] });

    if (!relatedProfile) return res.status(404).json({ message: "Not found" });
    // Auth
    if (relatedProfile?.userId !== req.session.user?.id) {
      if (req.session.user?.accountType !== "admin") return res.status(401).json({ message: "unauthorized" });
    }

    await relatedProfile.update({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      settlement: settlement,
      city: city,
      postcode: postcode,
      country: country
    });

    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error 301", err });
  }
};

export const deleteRentUserById = async (req: Request, res: Response) => {
  const profileId = Number(req.params.id);

  //FIX THIS PART
  //   try {
  //     const profile = await Profile.findByPk(profileId, { include: [Address] });
  //     if (!profile && profile!.Admin.userId !== userId) {
  //       return res.status(410).json({ message: "unauthorized" });
  //     }

  //     await Listing.destroy({ where: { id: listingId }, cascade: true });

  //     return res.status(200).json({ message: "Success" });
  //   } catch (err) {
  //     return res.status(500).json({ message: "Internal Server error", err });
  //   }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal Server error 301", err });
  }
};
