const charge = { succeeded: "" };

charge.succeeded = {
  id: "evt_3P8SZYIGvo7mWPbt0Mn9yfBB",
  object: "event",
  api_version: "2023-10-16",
  created: 1713814241,
  data: {
    object: {
      id: "ch_3P8SZYIGvo7mWPbt0laZBrMx",
      object: "charge",
      amount: 95900,
      amount_captured: 95900,
      amount_refunded: 0,
      amount_updates: [],
      application: null,
      application_fee: null,
      application_fee_amount: null,
      balance_transaction: "txn_3P8SZYIGvo7mWPbt0lN3kH5k",
      billing_details: {
        address: {
          city: null,
          country: "TC",
          line1: null,
          line2: null,
          postal_code: null,
          state: null
        },
        email: "sama@sama.com",
        name: "sama. jlouis",
        phone: null
      },
      calculated_statement_descriptor: "TCI HOMEBASE",
      captured: true,
      created: 1713814240,
      currency: "usd",
      customer: "cus_PyPOr7WLyyvhgP",
      description: "Subscription creation",
      destination: null,
      dispute: null,
      disputed: false,
      failure_balance_transaction: null,
      failure_code: null,
      failure_message: null,
      fraud_details: {},
      invoice: "in_1P8SZXIGvo7mWPbtUOQRzu3b",
      livemode: false,
      metadata: {},
      on_behalf_of: null,
      order: null,
      outcome: {
        network_status: "approved_by_network",
        reason: null,
        risk_level: "normal",
        risk_score: 57,
        seller_message: "Payment complete.",
        type: "authorized"
      },
      paid: true,
      payment_intent: "pi_3P8SZYIGvo7mWPbt05EBVMNN",
      payment_method: "pm_1P8SZWIGvo7mWPbtNMuXLhp7",
      payment_method_details: {
        card: {
          amount_authorized: 95900,
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
            maximum_amount_capturable: 95900,
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
        "https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xT1laYkJJR3ZvN21XUGJ0KOL1mrEGMgYOW7TXVXc6LBatuVtEGPIgZugS65P_ArIJOmt_gZE9Ch-dSERjvjAs3_NKoJlUTk_2mz2F?s=ap",
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
    id: "req_d18qUQ96u18hdo",
    idempotency_key: "33bec629-4062-4341-bc7f-b23a10223127"
  },
  type: "charge.succeeded"
};

const payment_intent = { succeeded: "" };
payment_intent.succeeded = {
  id: "evt_3P8SZYIGvo7mWPbt0jdk8Yar",
  object: "event",
  api_version: "2023-10-16",
  created: 1713814241,
  data: {
    object: {
      id: "pi_3P8SZYIGvo7mWPbt05EBVMNN",
      object: "payment_intent",
      amount: 95900,
      amount_capturable: 0,
      amount_details: {
        tip: {}
      },
      amount_received: 95900,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: "automatic",
      client_secret: "pi_3P8SZYIGvo7mWPbt05EBVMNN_secret_Z7PpKNPeDKrFeDgx5ZvG2g4ug",
      confirmation_method: "automatic",
      created: 1713814240,
      currency: "usd",
      customer: "cus_PyPOr7WLyyvhgP",
      description: "Subscription creation",
      invoice: "in_1P8SZXIGvo7mWPbtUOQRzu3b",
      last_payment_error: null,
      latest_charge: "ch_3P8SZYIGvo7mWPbt0laZBrMx",
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: "pm_1P8SZWIGvo7mWPbtNMuXLhp7",
      payment_method_configuration_details: null,
      payment_method_options: {
        card: {
          installments: null,
          mandate_options: null,
          network: null,
          request_three_d_secure: "automatic",
          setup_future_usage: "off_session"
        },
        link: {
          persistent_token: null
        },
        paypal: {
          preferred_locale: null,
          reference: null
        },
        us_bank_account: {
          mandate_options: {},
          verification_method: "automatic"
        }
      },
      payment_method_types: ["card", "link", "paypal", "us_bank_account"],
      processing: null,
      receipt_email: null,
      review: null,
      setup_future_usage: "off_session",
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
    id: "req_d18qUQ96u18hdo",
    idempotency_key: "33bec629-4062-4341-bc7f-b23a10223127"
  },
  type: "payment_intent.succeeded"
};

const checkout = { session: {} };
checkout.session.completed = {
  id: "evt_1P8SZcIGvo7mWPbtXCMOkzvE",
  object: "event",
  api_version: "2023-10-16",
  created: 1713814244,
  data: {
    object: {
      id: "cs_test_a1ddYZOfn0yjLImvbGeb6irwtgCvdS1iTAsC3t1N8wbDAExBfcPaPNIAeZ",
      object: "checkout.session",
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 95900,
      amount_total: 95900,
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
      created: 1713814184,
      currency: "usd",
      currency_conversion: null,
      custom_fields: [],
      custom_text: {
        after_submit: null,
        shipping_address: null,
        submit: null,
        terms_of_service_acceptance: null
      },
      customer: "cus_PyPOr7WLyyvhgP",
      customer_creation: "always",
      customer_details: {
        address: {
          city: null,
          country: "TC",
          line1: null,
          line2: null,
          postal_code: null,
          state: null
        },
        email: "sama@sama.com",
        name: "sama. jlouis",
        phone: null,
        tax_exempt: "none",
        tax_ids: []
      },
      customer_email: null,
      expires_at: 1713900584,
      invoice: "in_1P8SZXIGvo7mWPbtUOQRzu3b",
      invoice_creation: null,
      livemode: false,
      locale: null,
      metadata: {},
      mode: "subscription",
      payment_intent: null,
      payment_link: null,
      payment_method_collection: "always",
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
      subscription: "sub_1P8SZXIGvo7mWPbtnnQRhBY0",
      success_url: "http://localhost:8080/payments/rent/success",
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
