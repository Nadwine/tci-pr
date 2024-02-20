import { Request, Response } from "express";
import Offer from "../../database/models/offer";
import Profile from "../../database/models/profile";

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
    if (!profile) return res.status(400).json({ message: "Profile Incomplete" });

    const foundOffer = await Offer.findOne({ where: { listingId: listingId, userId: userId } });
    if (foundOffer) return res.status(400).json({ message: "Offer has already been sent" });

    const offer = await Offer.create({
      userId: userId,
      listingId: listingId,
      amount: amount,
      tenancyLengthDays: tenancyLengthDays,
      preferredStartDate: preferredStartDate
    });

    return res.status(200).json({ message: "success", offer: offer });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", err });
  }
};
