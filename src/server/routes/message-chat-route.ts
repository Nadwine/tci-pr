import { Request, Response } from "express";
import Message from "../../database/models/message";
import EnquiryConversation from "../../database/models/enquiry_conversation";
import Listing from "../../database/models/listing";
import Landlord from "../../database/models/landlord";
export const getMessagesByEnquiryConversationId = async (req: Request, res: Response) => {
  // TODO validate the session user can view requested conversation.
  // TODO Enable pagination on scroll (while scrolling up loads more previous messages)

  try {
    const me = "";
    const data = await Message.findAll({
      where: { enquiryConversationId: 1 },
      include: [{ model: EnquiryConversation, include: [{ model: Listing, include: [Landlord] }] }]
    });

    return res.json(null);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const sendMessageToConversation = async (req: Request, res: Response) => {
  const { userId, enquiryConversationId, messageText, messageType } = req.body;

  try {
    await Message.create({
      userId: userId,
      enquiryConversationId: enquiryConversationId,
      messageText: messageText,
      messageType: messageType
    }).catch(err => {
      return res.status(500).json({ message: "Internal Server error", err });
    });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};
