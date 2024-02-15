import { Request, Response } from "express";
import User from "../../database/models/user";
import Profile from "../../database/models/profile";
import ListingLandlord from "../../database/models/listing_landlord";

export const getProfileForLoggedInUser = async (req: Request, res: Response) => {
  const sessionUsr = req.session.user;

  try {
    const user = await Profile.findByPk(sessionUsr!.id, {
      include: [{ model: User, include: [ListingLandlord] }]
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 207", err });
  }
};
