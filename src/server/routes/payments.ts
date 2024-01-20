import { Request, Response } from "express";
import Stripe from "stripe";

export const createNewSubscription = async (req: Request, res: Response) => {
  if (req.session.user?.accountType !== "admin") return res.status(401).json({ message: "Unauthorized " });
  // TODO Validation
  // amountUSD: amountUSD,
  //     cardHolderName: cardHolderName,
  //     cardNumber: cardNumber,
  //     expiration: expiration,
  //     cvv: cvv

  try {
    const productName = req.body.productName;
    const USDCents = Number(req.body.amountUSD);
    const stripeConnector = new Stripe(process.env.STRIPE_SECRET_KEY);

    stripeConnector.prices.create({
      currency: "usd",
      unit_amount: USDCents,
      recurring: {
        interval: "month"
      },
      product_data: {
        name: productName
      }
    });

    return res.json(null);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};
