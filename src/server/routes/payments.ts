import { Request, Response } from "express";
import Stripe from "stripe";
import ListingLandlord from "../../database/models/listing_landlord";
import Listing from "../../database/models/listing";
import dayjs from "dayjs";

export const createNewRentMonthly = async (req: Request, res: Response) => {
  if (req.session.user?.accountType !== "admin") return res.status(401).json({ message: "Unauthorized " });
  // TODO Validation
  const { amountUSD, listingId } = req.body;
  // paymentReference: paymentReference,
  //     amountUSD: amountUSD,
  //     cardHolderName: cardHolderName,
  //     cardNumber: cardNumber,
  //     expiration: expiration,
  //     cvv: cvv

  try {
    const USDCents = parseFloat(amountUSD) * 100;
    const stripeConnector = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    let foundProduct = await stripeConnector.products.search({
      query: `name:'monthly_rent_${listingId}'`
    });

    let newPrice;
    if (foundProduct.data.length === 0) {
      newPrice = await stripeConnector.prices.create({
        currency: "usd",
        unit_amount: USDCents,
        recurring: {
          interval: "month"
        },
        product_data: {
          name: `monthly_rent_${listingId}`
        }
      });
    } else {
      newPrice = await stripeConnector.prices.search({
        query: `product:'${foundProduct.data[0].id}'`
      });
    }

    const paymentSession = await stripeConnector.checkout.sessions.create({
      line_items: [{ price: foundProduct.data.length === 0 ? newPrice.id : newPrice.data[0].id, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.BASE_URL}/payments/rent/success`,
      cancel_url: `${process.env.BASE_URL}/`
    });

    const now = dayjs();
    await Listing.update(
      {
        stripePaymentLink: {
          url: paymentSession.url || "",
          expiresAtUnixSeconds: paymentSession.expires_at,
          generatedAt: now.format("YYYY-MM-DD HH:MM:ss:SSS ZZ")
        }
      },
      { where: { id: listingId } }
    );

    // TODO save recent PaymentURL in DB
    return res.json({ paymentURL: paymentSession.url });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const createLandLordConnect = async (req: Request, res: Response) => {
  // use stripe connect
  // we will link landlord to listing in DB and create a connected account for him
  // this stripe connected account will hold his card and we will store is connected Id in out DB
  // /api/attachLandordToListing
  // card will be setup on the connected account from our api like /attachCard
  // Then when rent is paid we will click button on out website to pay him
  // /api/transfer/{landlordId}  (transfers-cross-border)
  // https://stripe.com/docs/connect/account-capabilities#transfers-cross-border
  // recommendation from stripe dev: https://stackoverflow.com/a/42188303
  // From stripe support
  // You will have to create a custom connected account, where you have to select the
  // payout-schedule as an automatic so that your customer does not have to ask for the payout.

  // https://stripe.com/docs/connect/collect-then-transfer-guide
  // https://stackoverflow.com/questions/75545426/payment-with-stripe-node-js-send-money-in-another-bank-account
  try {
    const stripeConnector = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
    const { landlordEmail, firstName, lastName, phoneNumber, homeIsland, address, cardDetails } = req.body;
    const { cardNumber, expMonth, expYear, cvv, account_holder_name } = req.body;
    // first register my stripe account https://dashboard.stripe.com/account/applications/settings
    const landlordStripeConnect = await stripeConnector.accounts.create({
      type: "custom",
      country: "GB",
      email: landlordEmail,
      default_currency: "usd",
      metadata: {
        firstName: firstName,
        lastName: lastName
      },
      settings: {
        payouts: {
          schedule: {
            interval: "manual"
          }
        }
      },
      capabilities: {
        card_payments: {
          requested: true
        },
        transfers: {
          requested: true
        },
        bank_transfer_payments: {
          requested: true
        },
        card_issuing: {
          requested: true
        },
        legacy_payments: {
          requested: true
        },
        link_payments: {
          requested: true
        },
        us_bank_account_ach_payments: {
          requested: true
        }
      }
    });

    // const landlorBankToken = await stripeConnector.tokens.create({
    //   bank_account: {
    //     country: "Turks and Caicos Islands",
    //     currency: 'usd',
    //     account_holder_name: account_holder_name,
    //     account_holder_type: account_holder_type || 'individual',
    //     routing_number: routing_number,
    //     account_number: account_number,
    //   },
    // });

    const landlordCardToken = stripeConnector.tokens.create({
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvv
      }
    });

    // // attach bank or card to landlord
    await stripeConnector.accounts.createExternalAccount(landlordStripeConnect.id, {
      // @ts-ignore
      external_account: landlordCardToken.id
    });

    await ListingLandlord.create({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      homeIsland: homeIsland,
      address: address,
      cardDetails: cardDetails,
      stripeConnectId: landlordStripeConnect.id
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  let stripeEvent = req.body.type;

  switch (stripeEvent) {
    case "payment_intent.succeeded":
      // const paymentIntentSucceeded = req.body.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled stripe event type ${stripeEvent}`);
  }
  console.log("STRIPE WebHook Hit");
};

// Hello i am a software developer and im trying to setup a model where i can collect rent from tenants and send that money to landlords. I am unsure whats the best way/stripeflow to accomplish this.
// Famida has joined.

// F
// Hi there! Thank you for contacting Stripe. This is Famida. I'll be assisting you today.

// Thank you for the details.
// Please allow me a minute for checking the details.

// i would perfer a model to auto send the funds to the landlords without them having to take any action. such as logging in to payout
// F
// Sure, I will check all the details for this.
// Please allow me a minute.
// OK
// F
// Thank you.
// Please give me a moment while I take a look into this. Thank you.
// no worries
// F
// Thank you.
// Upon checking, you can create a connected account.
// Ok i was exploring that option can I send a payout to landlord's connected account straight to the bank account or credit card?
// F
// To accept payments and move funds to the bank accounts of your sellers or service providers. It provides details on setting up and managing your platform's users, creating charges, and handling payouts.
// Docs doesn't specify is that is possible
// F
// I'm sorry but your payout will be Stripe account.
// So payouts can only be in stripe account?
// F
// Let me check all the options for you.
// Please allow me a minute.
// Do each connected account will have an associated payment method? what options do i have to send the landlord's connected account his linked payment method?
// F
// I am checking the details, please allow me a minute.
// 👍
// F
// Your account region is the United Kingdom, right?
// Use separate charges and transfers for Express or Custom accounts where you collect charges that might be a different amount than what’s paid out to your connected accounts. The platform is responsible for Stripe fees, refunds, and chargebacks.
// Ok I can do all of this straight using the stripe developer API?
// F
// May I know the country region because Stripe supports separate charges and transfers in the following regions:
// Australia
// Brazil
// Canada
// Europe
// Japan
// Malaysia
// New Zealand
// Singapore
// United States
// https://stripe.com/docs/connect/separate-charges-and-transfers
// My stripe account is in United Kingdom my connected landlords will receive their transfers in Turks & Caicos islands.
// is Turks & Caicos Islands Supported?
// F
// I am checking.
// i can see something with "transfers-cross-border" in the docs not sure how relevant that is
// F
// I'm working on your concern.
// Please stay connected.
// Ok
// Thanks a lot
// F
// You will have to create a custom connected account, where you have to select the payout schedule as an automatic so that your customer does not have to ask for the payout.
// Nice
// the cross region will not be an issue?
// F
// There would be no issues with cross region because your account region is supported.
// You can create a connected account for your landlords.
// For more information about connect account, please refer to our docs:
// https://stripe.com/docs/connect/accounts
// Is there anything else I can help you with today?

// Ok thanks for your help. do i get transcript of this chat?
