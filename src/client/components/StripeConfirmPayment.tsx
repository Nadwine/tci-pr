import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export const StripeConfirmPayment = (props: any) => {
  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        // success URL query come with status=success
        return_url: "https://localhost:8080/order/123/complete"
      }
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
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
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};

export default connect()(StripeConfirmPayment);
