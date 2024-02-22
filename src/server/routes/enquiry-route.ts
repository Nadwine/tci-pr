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
import ListingLandlord from "../../database/models/listing_landlord";

export const createEnquiryRoute = async (req: Request, res: Response) => {
  const listingId = Number(req.params.listingId);

  const listing = await Listing.findByPk(listingId, { include: [Admin] });
  const found = await EnquiryConversation.findOne({ where: { userId: req.session.user!.id, listingId: listingId } });

  if (found) return res.status(500).json({ message: "Failed to send enquiry. Already sent", err: "Already sent" });

  // Not allowed to submit enquiry on own listing
  if (!listing) {
    return res.status(500).json({ message: "Failed to send enquiry. Try again", err: "listing not found" });
  }
  if (listing?.Admin?.userId === req.session.user!.id || listing?.ListingLandlord?.userId === req.session.user?.id) {
    return res.status(500).json({ message: "Failed to send enquiry. You are the Admin Of this Listing", err: "listing owner" });
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
  const isAdmin = req.session.user?.accountType === "admin";
  const isLandlord = req.session.user?.accountType === "landlord";

  // TODO: remove limit and add pagination and filter by logged in user instead of using findAll
  let conversations: EnquiryConversation[] | void;

  if (!isLandlord) {
    conversations = await EnquiryConversation.findAll({
      where: isAdmin ? undefined : { userId: userId },
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
      limit: 1000
    }).catch(err => console.log("eror while enquiry", err));
  }

  if (isLandlord) {
    const landlordRecord = await ListingLandlord.findOne({ where: { userId: req.session.user!.id } });
    if (!landlordRecord) return res.status(200).json([]);
    const myListings = await Listing.findAll({ where: { landlordId: landlordRecord?.id } });
    conversations = await EnquiryConversation.findAll({
      where: { listingId: { [Op.in]: myListings.map(l => l.id) } },
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
      limit: 1000
    });
  }

  // @ts-ignore
  res.status(200).json(conversations);
};
