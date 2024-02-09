import { Request, Response } from "express";
import Profile from "../../database/models/profile";
import Address from "../../database/models/address";

export const createUserRoute = async (req: Request, res: Response) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const address = req.body.address;
  const phonenumber = req.body.phonenumber;

  try {
    await Profile.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      phonenumber: phonenumber
    });
    return res.status(200).json({ message: "Successful profile" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 201", err });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await Profile.findByPk(id, {
      include: [{ model: Profile }, { model: Address }]
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 207", err });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, address, phonenumber } = req.body;

  try {
    const relatedUser = await Profile.findByPk(id, { include: [Address] });

    if (!relatedUser) return res.status(404).json({ message: "Not found" });
    // ADD AUTH
    // if (relatedUser?.Profile.profileId !== req.session.user?.id) {
    //   return res.status(401).json({ message: "unauthorized" });
    // }
    const relatedAddress = await Address.findByPk(relatedUser?.Address.id);

    await relatedUser.update({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phonenumber: phonenumber
    });

    await relatedAddress?.update({
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      settlement: settlement,
      city: city,
      postcode: postcode,
      country: country
    });

    res.status(200).json();
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
