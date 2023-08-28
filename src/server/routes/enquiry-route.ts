import { Request, Response } from "express";
import EnquiryConversation from "../../database/models/enquiry_conversation";
import Listing from "../../database/models/listing";

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
