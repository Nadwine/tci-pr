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
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Hi &#x1F44B;</h2>
  <p style="font-family: arial;">You have received an enquiry for your property. <a href="${process.env.BASE_URL}/login" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Login to view</a></p><br></br><br></br><p style="font-size: 10px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, [landlordEmail], text, html);
  } catch {
    return;
  }
};

export const emailLandlord_on_TenantAcceptInvite = async (landlordEmail: string, tenantName: string) => {
  const subject = "TCI Homebase - Invitation Accepted";
  const text = `${tenantName} has accepted your invite to the tenancy. Please login to view and fill out ${tenantName}'s details`;
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Hi &#x1F44B;</h2>
  <p style="font-family: arial;">${tenantName} has accepted your invite to the tenancy. Please login to view and fill out ${tenantName}'s details. <a href="${process.env.BASE_URL}/login" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Login</a></p><br></br><br></br><p style="font-size: 10px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, [landlordEmail], text, html);
  } catch {
    return;
  }
};

export const emailLandlord_on_OfferReceived = async (landlordEmail: string) => {
  const subject = "TCI Homebase - New Offer Received";
  const text = "You have received an offer for your property. Please login to view";
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Hi &#x1F44B;</h2>
  <p style="font-family: arial;">You have received an offer for your property. <a href="${process.env.BASE_URL}/login" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Login to view</a></p><br></br><br></br><p style="font-size: 9px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, [landlordEmail], text, html);
  } catch {
    return;
  }
};

export const emailLandlord_on_ListingApproved = async (landlordEmail: string, paymentURL: string) => {
  const subject = "TCI Homebase - Listing Approval";
  const text = "Congratulations! Your listing Has been Approved ";
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Congratulations! &#127881;</h2>
  <p style="font-family: arial;">Your listing has been approved! Now there's just one more step... <br></br> Pay Now to add your listing to our site. You will shortly be able to receive enquiries from potential future tenants. Good luck and thank you for choosing TCI Homebase!<br></br><br></br> <a href="${paymentURL}" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Payment Link</a><br></br></p><br></br><br></br><p style="font-size: 9px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, [landlordEmail], text, html);
  } catch {
    return;
  }
};

export const emailLandlord_on_TenantSigned = async (landlordEmail: string) => {
  const subject = "TCI Homebase - New Document Signature";
  const text = "Your new tenant has signed a document. Please login to view";
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Hi &#x1F44B;</h2>
  <p style="font-family: arial;">Your new tenant has signed a document. <a href="${process.env.BASE_URL}/login" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Login to view</a></p><br></br><br></br><p style="font-size: 9px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, [landlordEmail], text, html);
  } catch {
    return;
  }
};

export const emailLandlord_on_TenantDocUpload = async (landlordEmail: string) => {
  const subject = "TCI Homebase - New Document Upload";
  const text = "Your new tenant has uploaded a document. Please login to view";
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Hi &#x1F44B;</h2>
  <p style="font-family: arial;">Your new tenant has uploaded a document. <a href="${process.env.BASE_URL}/login" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Login to view</a></p><br></br><br></br><p style="font-size: 9px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, [landlordEmail], text);
  } catch {
    return;
  }
};

export const emailTenant_on_OfferAccepted = async (tenantEmail: string) => {
  const subject = "TCI Homebase - Offer Accepted!";
  const text = "Congratulations, your offer has been accepted. Please login to view. Keep your eye on your tenancy page to complete any pending actions";
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Congratulations! &#127881;</h2>
  <p style="font-family: arial;">Your offer has been accepted!</p> <p style="font-family: arial;">Keep your eye on your tenancy page to complete any pending actions. </p> <a href="${process.env.BASE_URL}/login" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Login to view</a><br></br><br></br><p style="font-size: 9px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, [tenantEmail], text, html);
  } catch {
    return;
  }
};

export const emailTenant_on_OfferDeclined = async (tenantEmail: string) => {
  const subject = "TCI Homebase - Offer Declined";
  const text = "We're sorry, your offer has been declined. Not to worry, please take a look on the search page to view more properties available.";
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Hi there,</h2>
  <p style="font-family: arial;">We're sorry, your offer has been declined.</p> <p style="font-family: arial;">Not to worry, please take a look on the search page to view more properties available. </p> <a href="${process.env.BASE_URL}/login" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Login</a><br></br><br></br><p style="font-size: 9px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, [tenantEmail], text, html);
  } catch {
    return;
  }
};

export const emailTenants_on_LandlordAgreementUpload = async (tenantEmailList: string[]) => {
  const subject = "TCI Homebase - Document Upload";
  const text = "Your potential landlord has uploaded a document. Please login to view. Keep your eye on your tenancy page to complete any pending actions.";
  const html = `<html><h2 style="color: #087990; font-family: arial">TCI Homebase</h2>
  <br></br>
  <h2 style="font-family: arial;">Hi &#x1F44B;</h2>
  <p style="font-family: arial;">Your potential landlord has uploaded a document. Keep your eye on your tenancy page to complete any pending actions. <a href="${process.env.BASE_URL}/login" style="background-color: #087990; color: white; padding: 6px; text-decoration: none; border-radius: 3px; font-family: arial; font-size: 12px">Login to view</a></p><br></br><br></br><p style="font-size: 9px; color: grey;">© 2024 TCI Homebase. All rights reserved.</p><html>`;
  try {
    await sendMail(subject, tenantEmailList, text, html);
  } catch {
    return;
  }
};
