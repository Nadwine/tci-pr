import { Request, Response, Express } from "express";
import ListingLandlord from "../../database/models/listing_landlord";
import User from "../../database/models/user";
import Profile from "../../database/models/profile";

export const getAllLandlordsByUser = async (req: Request, res: Response) => {
  try {
    const listings = await User.findAll({
      where: {
        accountType: "landlord"
      },
      include: [{ model: Profile }, { model: ListingLandlord }]
    });
    return res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Internal Server error 88", err });
  }
};

export const getSessionLandlordProfile = async (req: Request, res: Response) => {
  const sessionUser = req.session.user;

  try {
    const profile = await Profile.findOne({ where: { userId: sessionUser!.id } });

    return res.status(200).json({ profile: profile });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error 88", err });
  }
};
