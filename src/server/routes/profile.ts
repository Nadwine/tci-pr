import { Request, Response } from "express";
import User from "../../database/models/user";
import Profile from "../../database/models/profile";
import ListingLandlord from "../../database/models/listing_landlord";
import { where } from "sequelize";
import Tenant from "../../database/models/tenant";

export const getProfileForLoggedInUser = async (req: Request, res: Response) => {
  const sessionUsr = req.session.user;

  try {
    const user = await Profile.findOne({
      where: { userId: sessionUsr!.id },
      include: [{ model: User, include: [ListingLandlord] }]
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 207", err });
  }
};

export const updateSessionUrsProfile = async (req: Request, res: Response) => {
  const sessionUsr = req.session.user;
  const accountType = sessionUsr?.accountType;
  const { firstName, lastName, phoneNumber, addressLine1, addressLine2, city, settlement } = req.body;
  const postcode = "TKCA 1ZZ";
  const country = "Turks and Caicos Islands";

  try {
    const found = await Profile.findOne({ where: { userId: sessionUsr!.id }, include: [{ model: User, include: [ListingLandlord, Tenant] }] });
    const newRec =
      found == null
        ? await Profile.create({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            city: city,
            settlement: settlement,
            postcode: postcode,
            country: country,
            email: sessionUsr!.email,
            userId: sessionUsr!.id
          })
        : null;

    if (found) {
      await found.update({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        settlement: settlement,
        postcode: postcode,
        country: country
      });

      // keep the landlord private profile in sync with his public profile
      if (accountType === "landlord") {
        const foundLandLord = await ListingLandlord.findOne({ where: { userId: sessionUsr!.id } });
        if (foundLandLord) {
          await ListingLandlord.update(
            {
              firstName: firstName,
              lastName: lastName,
              phoneNumber: phoneNumber,
              homeIsland: city,
              addressString: `${settlement && settlement + ","}${city && city + ","}${postcode && postcode + ","}${country && country}`
            },
            { where: { userId: sessionUsr?.id } }
          );
        } else {
          await ListingLandlord.create({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            homeIsland: city,
            userId: sessionUsr!.id,
            addressString: `${settlement && settlement + ","}${city && city + ","}${postcode && postcode + ","}${country && country}`
          });
        }
      }
    }

    await found?.reload();
    await newRec?.reload();

    //@ts-ignore
    return res.status(200).json(found || newRec);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 207", err });
  }
};
