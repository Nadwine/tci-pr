import { Request, Response } from "express";
import EnquiryConversation from "../../database/models/enquiry_conversation";
import Listing from "../../database/models/listing";
import Message from "../../database/models/message";
import User from "../../database/models/user";
import Address from "../../database/models/address";
import Admin from "../../database/models/admin";
import ListingMedia from "../../database/models/listing_media";
import ListingQuestion from "../../database/models/listing_question";
import PropertyForRent from "../../database/models/property_for_rent";
import { Op } from "sequelize";

export const createEnquiryRoute = async (req: Request, res: Response) => {
  const listingId = Number(req.params.listingId);

  const listing = await Listing.findByPk(listingId, { include: [Admin] });

  // Not allowed to submit enquiry on own listing
  if (!listing || listing.Admin.userId === req.session.user!.id) {
    return res.status(500).json({ message: "Failed to send enquiry. Try again", err: "listing not found" });
  }

  let msg = "";
  for (const [question, answer] of Object.entries(req.body)) {
    msg = `${msg} \n ${question == "message" ? "" : question} - ${answer}`;
  }

  EnquiryConversation.create({
    listingId: listingId,
    userId: req.session.user!.id,
    intro_message: msg
  })
    .then(() => {
      return res.status(200).json({ message: "Enquiry Sent" });
    })
    .catch(err => {
      return res.status(500).json({ message: "Failed to send enquiry. Try again", err });
    });
};

export const getLatestEnquiry = async (req: Request, res: Response) => {
  const userId = req.session.user!.id;
  let landlordListingIds: number[] = [];
  if (req.session.user?.accountType === "landlord") {
    const landLord = await Admin.findOne({ where: { userId: userId } });
    const landlordListings = await Listing.findAll({ where: { adminId: landLord!.id } });
    landlordListingIds = landlordListings.map(l => l.id);
  }

  // TODO: remove limit and add pagination and filter by logged in user instead of using findAll
  const conversations = await EnquiryConversation.findAll({
    where: {
      [Op.or]: [{ userId: userId }, { listingId: { [Op.in]: landlordListingIds } }]
    },
    include: [
      {
        model: Message,
        include: [{ model: EnquiryConversation, include: [{ model: Listing, include: [{ model: Admin }] }] }, { model: User }]
      },
      { model: User },
      {
        model: Listing,
        include: [
          { model: Address },
          { model: PropertyForRent },
          { model: ListingMedia, order: [["id", "ASC"]] },
          { model: Admin, include: [User] },
          { model: ListingQuestion }
        ]
      }
    ],
    order: [[{ model: Message, as: "Messages" }, "id", "ASC"]],
    limit: 50
  }).catch(err => console.log("eror while enquiry", err));
  res.status(200).json(conversations);
};
