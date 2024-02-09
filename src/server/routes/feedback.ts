import { Request, Response } from "express";
import Feedback from "../../database/models/feedback";

export const submitFeedback = async (req: Request, res: Response) => {
  const contentSatisfication = req.body.contentSatisfaction;
  const recommendation = req.body.recommendation;
  const additionalFeedback = req.body.additionalFeedback;

  try {
    await Feedback.create({
      contentSatisfication: contentSatisfication,
      recommendation: recommendation,
      additionalFeedback: additionalFeedback
    });
    return res.status(200).json({ message: "Successful feedback" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};
