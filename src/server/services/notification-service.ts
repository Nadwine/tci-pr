// TODO
const emailTenants_on_SignatureDocFinalisation = async (tenantEmailList: string[]) => {};
const emailLandlord_on_PleaseReviewOffers = async (landlordEmail: string) => {};

const sendMail = async (subject: string, emailList: string[], text: string, html?: string) => {
  const AWS = require("aws-sdk");
  const ses = new AWS.SES({
    region: process.env.AWS_SES_REGION,
    endpoint: process.env.AWS_SES_ENDPOINT,
    credentials: { accessKeyId: process.env.AWS_SES_KEY, secretAccessKey: process.env.AWS_SES_SECRET }
  });

  ses.sendEmail(
    {
      Destination: { ToAddresses: emailList },
      Message: {
        Body: {
          Html: { Data: html || text },
          Text: { Data: text }
        },
        Subject: {
          Data: subject
        }
      },
      Source: process.env.AWS_SES_EMAIL_ADDRESS
    },
    (emailFailedError, data) => {
      if (emailFailedError?.message) {
        console.log("Email Failed To Send Error", emailFailedError.message);
        return;
      } else {
        return;
      }
    }
  );
};
export const emailLandlord_on_EnquiryReceived = async (landlordEmail: string) => {
  const subject = "TCI Homebase - Enquiry Received";
  const text = "You have received an enquiry for your property. Please login to view";
  try {
    await sendMail(subject, [landlordEmail], text);
  } catch {
    return;
  }
};
export const emailLandlord_on_OfferReceived = async (landlordEmail: string) => {
  const subject = "TCI Homebase - New Offer Received";
  const text = "You have received an offer for your property. Please login to view";
  try {
    await sendMail(subject, [landlordEmail], text);
  } catch {
    return;
  }
};

export const emailLandlord_on_TenantSigned = async (landlordEmail: string) => {
  const subject = "TCI Homebase - New Document Signature";
  const text = "Your new tenant has signed a document. Please login to view";
  try {
    await sendMail(subject, [landlordEmail], text);
  } catch {
    return;
  }
};

export const emailLandlord_on_TenantDocUpload = async (landlordEmail: string) => {
  const subject = "TCI Homebase - New Document Upload";
  const text = "Your new tenant has uploaded a document. Please login to view";
  try {
    await sendMail(subject, [landlordEmail], text);
  } catch {
    return;
  }
};

export const emailTenant_on_OfferAccepted = async (tenantEmail: string) => {
  const subject = "TCI Homebase - Offer Accepted!";
  const text = "Congratulations, your offer has been accepted. Please login to view. Keep your eye on your tenancy page to complete any pending actions";
  try {
    await sendMail(subject, [tenantEmail], text);
  } catch {
    return;
  }
};

export const emailTenant_on_OfferDeclined = async (tenantEmail: string) => {
  const subject = "TCI Homebase - Offer Declined";
  const text = "We're sorry, your offer has been declined. Not to worry, please take a look on the search page to view more properties available.";
  try {
    await sendMail(subject, [tenantEmail], text);
  } catch {
    return;
  }
};

export const emailTenants_on_LandlordAgreementUpload = async (tenantEmailList: string[]) => {
  const subject = "TCI Homebase - Document Upload";
  const text = "Your potential landlord has uploaded a document. Please login to view. Keep your eye on your tenancy page to complete any pending actions.";
  try {
    await sendMail(subject, tenantEmailList, text);
  } catch {
    return;
  }
};
