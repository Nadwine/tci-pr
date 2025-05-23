import express, { NextFunction, Request, Response } from "express";
import Joi from "joi";
import {
  changePasswordFromEmailToken,
  confirmUserAccountFromEmailToken,
  getAppBuildInfo,
  getUserCredentials,
  loginUser,
  logoutUser,
  refreshUserPermission,
  registerUser,
  resendPasswordResetLinkToUserEmail,
  resendVerificationToUserEmail
} from "./routes/auth";
import { ensureAdmin, ensureAuthentication, ensureLandlord, ensureLogout } from "./middlewareFunctions/auth-middleware";
import multer from "multer";
import dayjs from "dayjs";
import {
  adminCreateRentListingRoute,
  deleteRentListingById,
  getRentListingById,
  landlordViewMyListings,
  searchRentListingRoute,
  searchSaleListingRoute,
  getRandomListings,
  adminUpdateRentListingById,
  getAllListings,
  getApproveFromListings,
  setApprovalValueRoute,
  getExpandedRentListingById,
  landLordSubmitRentListingRoute,
  getLandlordListings,
  toggleASaveListing,
  getMySavedListings,
  getPublicListingsByUserId
} from "./routes/listing-route";
import { createEnquiryRoute, getLatestEnquiry } from "./routes/enquiry-route";
import { getMessagesByEnquiryConversationId, sendMessageToConversation, setMessageAsSeen } from "./routes/message-chat-route";
import {
  adminCreateLandLordForListing,
  attachCardToLandlord,
  redirectStripePackagePayment,
  collectSinglePayment,
  createNewRentMonthly,
  payLandlordForProperty,
  stripeWebhook
} from "./routes/payments";
import { submitFeedback } from "./routes/feedback";
import { getAllUsers } from "./routes/user";
import { getAllLandlordsByUser, getLanlordUserById, getSessionLandlordProfile } from "./routes/landlord";
import { getProfileForLoggedInUser, updateSessionUrsProfile, uploadSessionUserProfilePicture } from "./routes/profile";
import { sendContactUsMail } from "./routes/mailing-route";
import { acceptOrDeclineOffer, sendOffer } from "./routes/offer-route";
import { adminGetAllTenants, getTenantById } from "./routes/tenant-route";
import {
  acceptInviteToTenancy,
  archiveTenancyRoute,
  createTenancyRoute,
  getAllTenancies,
  getLandlordTenancies,
  getSessionUserTenancies,
  getTenancyById,
  sendInviteLinkToTenantEmail,
  updateTenancyRoute
} from "./routes/tenancy-route";
import { getTenancyAgreementFromS3Bucket, uploadTenancyAgreement } from "./routes/tenancy-document-route";
import { uploadNewPropertyDoc } from "./routes/property_doc_route";
import { createNewExpenseWithDoc } from "./routes/expense-route";

const memStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memStorage });
const router = express.Router();

// Custom Joi validation middleware
const validateJoi = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.message,
        err: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Logger to console log all api routes called
router.use("*", (req: Request, res: Response, next: NextFunction) => {
  const isAsset = req.rawHeaders.filter(h => h.includes("image") || h.includes("video")).length > 0;

  if (!isAsset && req.originalUrl !== "/api/auth/credentials" && req.originalUrl !== "/api/auth/refresh-perms" && req.originalUrl !== "/api/enquiry/latest") {
    res.on("finish", () => {
      console.log(`${req.method}(${res.statusCode})`, req.originalUrl, `  --  ${dayjs().format("h:mm a")}`);
    });
  }
  next();
});

router.get("/environment", (req, res) => res.send(process.env.NODE_ENV));

// api/auth routes
router.get("/auth/credentials", getUserCredentials);
router.get("/auth/refresh-perms", refreshUserPermission);
router.get("/auth/app-build-info", getAppBuildInfo);
router.post("/auth/register", ensureLogout, registerUser);
router.get("/auth/register-confirm/:token", confirmUserAccountFromEmailToken);
router.post("/auth/resend-verification", resendVerificationToUserEmail);
router.post("/auth/forget-password/send-email", resendPasswordResetLinkToUserEmail);
router.post("/auth/forget-password/:token", changePasswordFromEmailToken);
router.post("/auth/login", loginUser);
router.get("/auth/logout", logoutUser);

// /api/listing routes
router.post("/listing/rent/create", ensureAdmin, uploadMemory.any(), adminCreateRentListingRoute);
router.post("/listing/rent/landlord/create", ensureAuthentication, uploadMemory.any(), landLordSubmitRentListingRoute);
router.get("/listing/rent/search", searchRentListingRoute);
router.get("/listing/sale/search", searchSaleListingRoute);
router.get("/listing/rent/:id", getRentListingById);
router.get("/listing/rent/expanded/:id", ensureAuthentication, getExpandedRentListingById);
router.put("/listing/rent/:id", ensureAuthentication, uploadMemory.any(), adminUpdateRentListingById);
router.delete("/listing/rent/:id", ensureAuthentication, deleteRentListingById);
router.get("/listing/listings", ensureAuthentication, landlordViewMyListings);
router.get("/listing/random", getRandomListings);
router.get("/listings", ensureAdmin, getAllListings);
router.get("/listings/approve", ensureAdmin, getApproveFromListings);
router.post("/listing/approve-status", ensureAdmin, setApprovalValueRoute);
router.get("/listing/landlord/my-listings", ensureLandlord, getLandlordListings);
router.post("/listing/:listingId/save-unsave", ensureAuthentication, toggleASaveListing);
router.get("/listing/my-saved", ensureAuthentication, getMySavedListings);
router.get("/listing/landlord/profile-properties/:id", getPublicListingsByUserId);

// /api/enquiry routes
router.post("/enquiry/set-seen", ensureAuthentication, setMessageAsSeen);
router.post("/enquiry/:listingId", ensureAuthentication, createEnquiryRoute);
router.get("/enquiry/latest", ensureAuthentication, getLatestEnquiry);

// /api/message routes
router.get("/message/enquiry/:enquiryConversationId", ensureAuthentication, getMessagesByEnquiryConversationId);
router.post("/message/enquiry", ensureAuthentication, sendMessageToConversation);

// /api/payments routes
router.post("/payment/rent/create/monthly-payment-link", ensureAdmin, createNewRentMonthly);
router.post("/payment/single-collect", ensureAdmin, collectSinglePayment);
router.post("/payment/rent/attach-landlord", ensureAuthentication, adminCreateLandLordForListing);
router.post("/payment/add-landlord-card", ensureAuthentication, attachCardToLandlord);
router.post("/payment/pay-out-landlord", ensureAuthentication, payLandlordForProperty);
router.get("/payment/package/:listingId", redirectStripePackagePayment);
router.post("/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// /api/feedback
router.post("/feedback/create", submitFeedback);

// /api/user
router.get("/users", ensureAdmin, getAllUsers);

// /api/landlord
router.get("/landlords", ensureAdmin, getAllLandlordsByUser);
router.get("/landlord/profile", ensureAuthentication, getSessionLandlordProfile);
router.get("/landlord/:id", ensureAuthentication, getLanlordUserById);

// /api/profile
router.get("/profile/my-profile/", ensureAuthentication, getProfileForLoggedInUser);
router.put("/profile/my-profile/", ensureAuthentication, updateSessionUrsProfile);
router.post("/profile/upload-picture", ensureAuthentication, uploadMemory.any(), uploadSessionUserProfilePicture);

// /api/mailing
router.post("/mailing/contact-us", sendContactUsMail);
router.post("/mailing/enquiry-creation", () => null);
router.post("/mailing/offer-sent", () => null);
router.post("/mailing/offer-accepted", () => null);

// /api/offer
router.post("/offer/send", ensureAuthentication, sendOffer);
router.post("/offer/status", ensureAuthentication, acceptOrDeclineOffer);

// /api/tenant
router.get("/tenant/all", ensureAdmin, adminGetAllTenants);
router.get("/tenant/:id", ensureAdmin, getTenantById);

// /api/tenancy
router.get("/tenancy/all", ensureAdmin, getAllTenancies);
router.get("/tenancy/user", ensureAuthentication, getSessionUserTenancies);
router.get("/tenancy/landlord", ensureAuthentication, getLandlordTenancies);
router.get("/tenancy/:id", ensureAuthentication, getTenancyById);
router.put("/tenancy/update", ensureAuthentication, updateTenancyRoute);
router.put("/tenancy/archive", ensureAuthentication, archiveTenancyRoute);

// /api/tenancy-document
router.post("/tenancy-document/upload-agreement", ensureAuthentication, uploadMemory.any(), uploadTenancyAgreement);
router.get("/tenancy-document/:tenancyId", ensureAuthentication, getTenancyAgreementFromS3Bucket);

// /api/property-document
router.post("/property-document/upload", ensureAuthentication, uploadMemory.any(), uploadNewPropertyDoc);

// /api/invite
router.get("/invite/accept-invitation", acceptInviteToTenancy);
router.post("/invite/send-invitation", ensureAuthentication, sendInviteLinkToTenantEmail);

// /api/expense
router.post("/expense/create", ensureAuthentication, uploadMemory.any(), createNewExpenseWithDoc);

export default router;
