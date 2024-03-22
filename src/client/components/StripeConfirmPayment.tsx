import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import ListingLandlord from "../../database/models/listing_landlord";
import axios from "axios";
import { toast } from "react-toastify";

export const StripeConfirmPayment = (props: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const paymentRef = useRef();
  const landlord: ListingLandlord = props.landlord;
  const clientSecret = props.clientSecret;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // const bankElement = elements?.getElement("iban");

    //TODO what is the flow when failed like cvv etc
    // if (!bankElement) return;
    // const tokenRes = await stripe.collectBankAccountToken(bankElement, { currency: "usd" });
    const result = await stripe.collectBankAccountForSetup({
      //`Elements` instance that was used to create the Payment Element
      // elements,
      clientSecret: clientSecret,
      params: {
        payment_method_type: "us_bank_account",
        payment_method_data: {
          billing_details: {
            address: {
              city: "string",
              country: "TC",
              line1: "string",
              line2: "string",
              postal_code: "string",
              state: "string"
            },
            name: "",
            email: "",
            phone: ""
          }
        }
      }
      // return_url: window.location.href
      // confirmParams: {
      //   // success URL query come with status=success
      //   return_url: window.location.href
      // }
    });

    if (!result.error) {
      await axios.post("/api/payment/add-landlord-card", { landlordId: landlord.id, intent: result?.setupIntent });
    }

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      toast.error(result.error.message);
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      // with the Succeeded Query params below
      // setup_intent= the setup intent id
      // setup_intent_client_secret=the secret
      // redirect_status=succeeded
    }
  }

  return (
    <form onSubmit={handleSubmit} className="py-3" style={{ maxWidth: 600 }}>
      <div className="fs-4 pt-5">Link Debit Card</div>
      {/* <Swit options={{ supportedCountries: ["SEPA"] }} /> */}
      <input />
      <button className="btn-sm mt-4 btn-success">Save</button>
    </form>
  );
};

export default connect()(StripeConfirmPayment);
