const charge = {};
charge.succeeded = {
  id: "evt_3P8SNzIGvo7mWPbt0A4678lm",
  object: "event",
  api_version: "2023-10-16",
  created: 1713813524,
  data: {
    object: {
      id: "ch_3P8SNzIGvo7mWPbt0T9EVHxi",
      object: "charge",
      amount: 2000,
      amount_captured: 2000,
      amount_refunded: 0,
      amount_updates: [],
      application: null,
      application_fee: null,
      application_fee_amount: null,
      balance_transaction: "txn_3P8SNzIGvo7mWPbt06Un5uIF",
      billing_details: {
        address: {
          city: null,
          country: "TC",
          line1: null,
          line2: null,
          postal_code: null,
          state: null
        },
        email: "sam@blaa.com",
        name: "SLllal",
        phone: null
      },
      calculated_statement_descriptor: "TCI HOMEBASE",
      captured: true,
      created: 1713813523,
      currency: "usd",
      customer: null,
      description: null,
      destination: null,
      dispute: null,
      disputed: false,
      failure_balance_transaction: null,
      failure_code: null,
      failure_message: null,
      fraud_details: {},
      invoice: null,
      livemode: false,
      metadata: {},
      on_behalf_of: null,
      order: null,
      outcome: {
        network_status: "approved_by_network",
        reason: null,
        risk_level: "normal",
        risk_score: 30,
        seller_message: "Payment complete.",
        type: "authorized"
      },
      paid: true,
      payment_intent: "pi_3P8SNzIGvo7mWPbt0cZkaW3r",
      payment_method: "pm_1P8SNyIGvo7mWPbtGkzTeRRR",
      payment_method_details: {
        card: {
          amount_authorized: 2000,
          brand: "visa",
          checks: {
            address_line1_check: null,
            address_postal_code_check: null,
            cvc_check: "pass"
          },
          country: "US",
          exp_month: 12,
          exp_year: 2024,
          extended_authorization: {
            status: "disabled"
          },
          fingerprint: "8nLKb6ubPLprLTrf",
          funding: "credit",
          incremental_authorization: {
            status: "unavailable"
          },
          installments: null,
          last4: "4242",
          mandate: null,
          multicapture: {
            status: "unavailable"
          },
          network: "visa",
          network_token: {
            used: false
          },
          overcapture: {
            maximum_amount_capturable: 2000,
            status: "unavailable"
          },
          three_d_secure: null,
          wallet: null
        },
        type: "card"
      },
      radar_options: {},
      receipt_email: null,
      receipt_number: null,
      receipt_url:
        "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xT1laYkJJR3ZvN21XUGJ0KJTwmrEGMgZ0oHXJdpQ6LBZa_unfrbgjw-OcK9BTL3LQmDTa_oDWXPqbDDbwDV1nT-if7ftAtInzjN_R",
      refunded: false,
      review: null,
      shipping: null,
      source: null,
      source_transfer: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: "succeeded",
      transfer_data: null,
      transfer_group: null
    }
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: "req_6cfwQAbCP0r8wO",
    idempotency_key: "898d4ee1-1abe-431d-9248-5cfcbe3880c2"
  },
  type: "charge.succeeded"
};

const checkout = {};
checkout.session.completed = {
  id: "evt_1P8mTHIGvo7mWPbt6kYaDIYd",
  object: "event",
  api_version: "2023-10-16",
  created: 1713890731,
  data: {
    object: {
      id: "cs_test_a1tfaXwTS9m9zl0gduPPJnjosF5x6HOMg6N7ETqOZabXwVqHrKYEZZ4xb8",
      object: "checkout.session",
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 1000,
      amount_total: 1000,
      automatic_tax: {
        enabled: false,
        liability: null,
        status: null
      },
      billing_address_collection: null,
      cancel_url: "http://localhost:8080/",
      client_reference_id: null,
      client_secret: null,
      consent: null,
      consent_collection: null,
      created: 1713890609,
      currency: "usd",
      currency_conversion: null,
      custom_fields: [],
      custom_text: {
        after_submit: null,
        shipping_address: null,
        submit: null,
        terms_of_service_acceptance: null
      },
      customer: null,
      customer_creation: "if_required",
      customer_details: {
        address: {
          city: null,
          country: "TC",
          line1: null,
          line2: null,
          postal_code: null,
          state: null
        },
        email: "Sama@smam.com",
        name: "namenamenamenane",
        phone: null,
        tax_exempt: "none",
        tax_ids: []
      },
      customer_email: null,
      expires_at: 1713977009,
      invoice: null,
      invoice_creation: {
        enabled: false,
        invoice_data: {
          account_tax_ids: null,
          custom_fields: null,
          description: null,
          footer: null,
          issuer: null,
          metadata: {},
          rendering_options: null
        }
      },
      livemode: false,
      locale: null,
      metadata: {
        listingId: "21",
        reference: "basic package"
      },
      mode: "payment",
      payment_intent: "pi_3P8mTFIGvo7mWPbt1E9GHaRC",
      payment_link: null,
      payment_method_collection: "if_required",
      payment_method_configuration_details: {
        id: "pmc_1OnbajIGvo7mWPbtdaeA8OKO",
        parent: null
      },
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic"
        }
      },
      payment_method_types: ["card", "link"],
      payment_status: "paid",
      phone_number_collection: {
        enabled: false
      },
      recovered_from: null,
      saved_payment_method_options: null,
      setup_intent: null,
      shipping_address_collection: null,
      shipping_cost: null,
      shipping_details: null,
      shipping_options: [],
      status: "complete",
      submit_type: null,
      subscription: null,
      success_url: "http://localhost:8080/payments/success",
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 0
      },
      ui_mode: "hosted",
      url: null
    }
  },
  livemode: false,
  pending_webhooks: 3,
  request: {
    id: null,
    idempotency_key: null
  },
  type: "checkout.session.completed"
};

const payment_intent = {};
payment_intent.succeeded = {
  id: "evt_3P8SNzIGvo7mWPbt0QYUIaI4",
  object: "event",
  api_version: "2023-10-16",
  created: 1713813524,
  data: {
    object: {
      id: "pi_3P8SNzIGvo7mWPbt0cZkaW3r",
      object: "payment_intent",
      amount: 2000,
      amount_capturable: 0,
      amount_details: {
        tip: {}
      },
      amount_received: 2000,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: "automatic",
      client_secret: "pi_3P8SNzIGvo7mWPbt0cZkaW3r_secret_IN8FlsFeKG1ooFZC5br5DcjBh",
      confirmation_method: "automatic",
      created: 1713813523,
      currency: "usd",
      customer: null,
      description: null,
      invoice: null,
      last_payment_error: null,
      latest_charge: "ch_3P8SNzIGvo7mWPbt0T9EVHxi",
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: "pm_1P8SNyIGvo7mWPbtGkzTeRRR",
      payment_method_configuration_details: null,
      payment_method_options: {
        card: {
          installments: null,
          mandate_options: null,
          network: null,
          request_three_d_secure: "automatic"
        }
      },
      payment_method_types: ["card"],
      processing: null,
      receipt_email: null,
      review: null,
      setup_future_usage: null,
      shipping: null,
      source: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: "succeeded",
      transfer_data: null,
      transfer_group: null
    }
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: "req_6cfwQAbCP0r8wO",
    idempotency_key: "898d4ee1-1abe-431d-9248-5cfcbe3880c2"
  },
  type: "payment_intent.succeeded"
};
