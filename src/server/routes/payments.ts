import { Request, Response } from "express";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ListingLandlord from "../../database/models/listing_landlord";
import Listing from "../../database/models/listing";
import dayjs from "dayjs";
import User from "../../database/models/user";
import messages from "../../database/fake-data/messages";
import PropertyForRent from "../../database/models/property_for_rent";

const dollarsToCent = (amountUSD: number) => {
  return parseFloat(`${amountUSD}`) * 100;
};

export const collectSinglePayment = async (req: Request, res: Response) => {
  if (req.session.user?.accountType !== "admin") return res.status(401).json({ message: "Unauthorized " });
  // TODO Validation
  const { amountUSD, listingId, ref } = req.body;
  // paymentReference: paymentReference,
  //     amountUSD: amountUSD,
  //     cardHolderName: cardHolderName,
  //     cardNumber: cardNumber,
  //     expiration: expiration,
  //     cvv: cvv

  try {
    const USDCents = parseFloat(amountUSD) * 100;
    const stripeConnector = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    // let foundProduct = await stripeConnector.products.search({
    //   query: `name:'monthly_rent_${listingId}'`
    // });

    const newPrice = await stripeConnector.prices.create({
      currency: "usd",
      unit_amount: USDCents,
      product_data: {
        name: `${ref}_${listingId}_d=${dayjs().format("YYYY-MM-DD")}`
      }
    });

    const paymentSession = await stripeConnector.checkout.sessions.create({
      line_items: [{ price: newPrice.id, quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/payments/success`,
      cancel_url: `${process.env.BASE_URL}/`
    });

    const now = dayjs();

    return res.json({ url: paymentSession.url, expiresAtUnixSeconds: paymentSession.expires_at, generatedAt: now.format("YYYY-MM-DD HH:MM:ss:SSS ZZ") });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

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
    return res.json({ url: paymentSession.url, expiresAtUnixSeconds: paymentSession.expires_at, generatedAt: now.format("YYYY-MM-DD HH:MM:ss:SSS ZZ") });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};
// Inactive route
export const adminCreateLandLordForListing = async (req: Request, res: Response) => {
  const sessUsr = req.session.user;
  res.json();
  if (sessUsr?.accountType !== "landlord" && sessUsr?.accountType !== "admin") {
    return res.status(401).json({ message: "unauthorized" });
  }
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
    const { landlordEmail, firstName, lastName, phoneNumber, homeIsland, address, cardDetails, listingId } = req.body;
    const { cardNumber, expMonth, expYear, cvv, nameOnCard } = req.body;

    const user = await User.findOne({ where: { email: landlordEmail } });
    let landlord = user && (await ListingLandlord.findOne({ where: { userId: user.id } }));

    if (!landlord) {
      // create him with a default password and send him a password reset link
      const salt = await bcrypt.genSalt();
      const defaultPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      const hashedCardNo = await bcrypt.hash(cardNumber, salt);
      const hashedCardCvv = await bcrypt.hash(cvv, salt);
      const createdUserCallback: User | null = await User.create({
        email: landlordEmail.toLowerCase(),
        password: hashedPassword,
        company: "",
        verified: true,
        accountType: "landlord"
      });

      const listing = await Listing.findByPk(listingId);

      landlord = await ListingLandlord.create({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        homeIsland: homeIsland,
        addressString: address,
        userId: createdUserCallback.id,
        cardDetails: { cardNumber: hashedCardNo, expMonth, expYear, cvv: hashedCardCvv, nameOnCard }
      });

      listing?.update({
        landlordId: landlord.id
      });

      const hashSecret = process.env.EMAIL_TOKEN_HASH_SECRET || "";
      const emailToken = jwt.sign({ userEmail: landlordEmail }, hashSecret, {
        expiresIn: "5h"
      });
      const emailLink = `${process.env.BASE_URL}/forget-password/${emailToken}?status=sent`;
      const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
      <br></br>
      <h2 style="font-family: arial;">Hi &#x1F44B;</h2>
      <p style="font-family: arial;">Please click the button below to reset your password:</p><a href="${emailLink}" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Reset Password</a><br></br><br></br><p style="font-size: 9px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;

      const AWS = require("aws-sdk");
      const ses = new AWS.SES({
        region: process.env.AWS_SES_REGION,
        endpoint: process.env.AWS_SES_ENDPOINT,
        credentials: { accessKeyId: process.env.AWS_SES_KEY, secretAccessKey: process.env.AWS_SES_SECRET }
      });

      ses.sendEmail(
        {
          Destination: { ToAddresses: [landlordEmail] },
          Message: {
            Body: {
              Html: { Data: html },
              Text: { Data: html }
            },
            Subject: {
              Data: "Password Reset"
            }
          },
          Source: process.env.AWS_SES_EMAIL_ADDRESS
        },
        (emailFailedError, data) => {
          if (emailFailedError?.message) {
            console.log("Email Failed To Send Error", emailFailedError.message);
            return res.status(500).json({ message: "internal Server error. Email Failed" });
          }
        }
      );
    }

    // first register my stripe account https://dashboard.stripe.com/account/applications/settings
    //You’ll provide this ID value to authenticate as the connected account by passing it into requests in the Stripe-Account header.
    let landlordStripeConnect: Stripe.Account;
    let customer: Stripe.Customer | Stripe.DeletedCustomer;

    if (!landlord?.stripeConnectId) {
      landlordStripeConnect = await stripeConnector.accounts.create({
        // created accnt found here can manually setup a credit card here which will accept payouts
        // https://dashboard.stripe.com/test/connect/accounts/overview
        type: "custom",
        country: "GB",
        email: landlordEmail,
        default_currency: "gbp",
        metadata: {
          landlordId: landlord.id,
          firstName: firstName,
          lastName: lastName
        },
        settings: {
          payouts: {
            schedule: {
              interval: "daily"
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
          us_bank_account_ach_payments: {
            requested: true
          }
        }
      });
    }
    if (landlord.stripeConnectId) {
      landlordStripeConnect = await stripeConnector.accounts.retrieve(landlord.stripeConnectId);
    }

    const card = landlord.cardDetails || {
      number: cardNumber,
      exp_month: expMonth,
      exp_year: expYear,
      cvc: cvv
    };

    // now create account link for onboarding to let landlord add his card
    // const accountLink = await stripeConnector.accountLinks.create({
    //   account: landlordStripeConnect.id,
    //   refresh_url: "https://example.com/reauth",
    //   return_url: `${process.env.BASE_URL}/return`,
    //   type: "account_update"
    // });

    if (!landlord.stripeCustomerId) {
      customer = await stripeConnector.customers.create({
        name: `${firstName} ${lastName}`,
        email: landlordEmail,
        metadata: {
          landlordId: landlord.id,
          connectId: landlordStripeConnect!.id,
          firstName: firstName,
          lastName: lastName
        }
        // address: {
        //   city:
        // }
      });
    }
    if (landlord.stripeCustomerId) {
      customer = await stripeConnector.customers.retrieve(landlord.stripeCustomerId);
    }

    // const token = await stripeConnector.tokens.create({})

    // const method = await stripeConnector.paymentMethods.create({type: "card", card : { token: token.id }});

    const setupIntent = await stripeConnector.setupIntents.create({
      payment_method_types: ["customer_balance"],
      customer: customer!.id,
      // description: "",
      metadata: {
        landlordId: landlord.id,
        connectId: landlordStripeConnect!.id,
        firstName: firstName,
        lastName: lastName,
        email: landlordEmail
      }
    });

    // currently the customer is created but the payment method is not linked to his connected account
    // we may not need to do the below
    // after confirming the intent on the front end attach it using this
    // await stripeConnector.paymentMethods.attach(<string>setupIntent.payment_method, {
    //   customer: customer.id
    // });

    await landlord.update({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      homeIsland: homeIsland,
      addressString: address,
      cardDetails: card,
      stripeConnectId: landlordStripeConnect!.id,
      stripeCustomerId: customer!.id
    });

    return res.json({ intentId: setupIntent.id, clientSecret: setupIntent.client_secret, landlord: landlord });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const payLandlordForProperty = async (req: Request, res: Response) => {
  const stripeConnector = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

  const propertyForRentId = req.body.propertyForRentId;
  const landlordId = req.body.landlordId;

  try {
    const landlord = await ListingLandlord.findByPk(landlordId);
    const property = await PropertyForRent.findByPk(propertyForRentId);

    if (!landlord?.stripeConnectId || !landlord.stripeCustomerId) {
      return res.status(400).json({ message: "Landlord stripe details incomplete" });
    }

    const paymentMethods = await stripeConnector.customers.listPaymentMethods(landlord?.stripeCustomerId, {
      limit: 3
    });

    // await stripeConnector.accounts.update("", {
    //   settings: {
    //     payouts: {
    //       schedule
    //     }
    //   }
    // })

    // NOT WORKING
    const intent = await stripeConnector.paymentIntents.create({
      currency: "usd",
      amount: dollarsToCent(0.5),
      customer: landlord?.stripeCustomerId,
      confirm: true,
      payment_method: paymentMethods.data[0].id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      }
    });

    const charge = await stripeConnector.refunds.create({
      payment_intent: intent.id,
      amount: dollarsToCent(property?.rentAmount || 0)
    });

    return res.json({ message: "success", charge });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const attachCardToLandlord = async (req: Request, res: Response) => {
  const stripeConnector = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

  const landlordId = req.body.landlordId;
  const tokenId = req.body.tokenId;

  try {
    const landlord = await ListingLandlord.findByPk(landlordId);
    // const property = await PropertyForRent.findByPk(propertyForRentId);

    if (!landlord?.stripeConnectId || !landlord.stripeCustomerId) {
      return res.status(400).json({ message: "Landlord stripe details incomplete" });
    }

    const paymentMethods = await stripeConnector.customers.listPaymentMethods(landlord?.stripeCustomerId, {
      limit: 3
    });

    await stripeConnector.accounts.createExternalAccount(landlord.stripeConnectId, {
      external_account: tokenId
    });

    return res.json({ message: "success" });
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
    case "setup_intent.succeeded":
      // We will pull in the setup intent and update the landlord connect account with the payment method
      console.log();
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
