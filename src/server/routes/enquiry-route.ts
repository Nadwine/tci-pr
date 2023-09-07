import { Request, Response } from "express";
import EnquiryConversation from "../../database/models/enquiry_conversation";
import Listing from "../../database/models/listing";
import Message from "../../database/models/message";
import User from "../../database/models/user";
import Address from "../../database/models/address";
import Landlord from "../../database/models/landlord";
import ListingMedia from "../../database/models/listing_media";
import ListingQuestion from "../../database/models/listing_question";
import PropertyForRent from "../../database/models/property_for_rent";

export const createEnquiryRoute = async (req: Request, res: Response) => {
  const listingId = Number(req.params.listingId);

  const listing = await Listing.findByPk(listingId);
  if (!listing || listing.landlordId === req.session.user!.id) {
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
  // TODO: remove limit and add pagination
  const conversations = await EnquiryConversation.findAll({
    include: [
      { model: Message, include: [User] },
      {
        model: Listing,
        include: [
          { model: Address },
          { model: PropertyForRent },
          { model: ListingMedia, order: [["id", "ASC"]] },
          { model: Landlord, include: [User] },
          { model: ListingQuestion }
        ]
      }
    ],
    limit: 50
  });
  res.status(200).json(conversations);
};
