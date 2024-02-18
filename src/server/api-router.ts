import express, { NextFunction, Request, Response } from "express";
import { validate } from "express-yup";
import {
  changePasswordFromEmailToken,
  confirmUserAccountFromEmailToken,
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
  updateRentListingById,
  getAllListings,
  getApproveFromListings,
  setApprovalValueRoute,
  getExpandedRentListingById,
  landLordSubmitRentListingRoute,
  getLandlordListings
} from "./routes/listing-route";
import { createEnquiryRoute, getLatestEnquiry } from "./routes/enquiry-route";
import { getMessagesByEnquiryConversationId, sendMessageToConversation, setMessageAsSeen } from "./routes/message-chat-route";
import { adminCreateLandLordForListing, createNewRentMonthly, stripeWebhook } from "./routes/payments";
import { submitFeedback } from "./routes/feedback";
import { getAllUsers } from "./routes/user";
import { getAllLandlordsByUser, getSessionLandlordProfile } from "./routes/landlord";
import { getProfileForLoggedInUser, updateSessionUrsProfile } from "./routes/profile";
const memStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memStorage });
const router = express.Router();

// Logger to console log all api routes called;
router.use("*", (req: Request, res: Response, next: NextFunction) => {
  // If it is an image or video or static asset we will ignore url log
  // will log too many times 1 page can load multiple images
  const isAsset = req.rawHeaders.filter(h => h.includes("image") || h.includes("video")).length > 0;

  // "/api/auth/credentials & refresh-perms is called too many times"
  if (!isAsset && req.originalUrl !== "/api/auth/credentials" && req.originalUrl !== "/api/auth/refresh-perms" && req.originalUrl !== "/api/enquiry/latest") {
    res.on("finish", () => {
      // console.log(`Responded with status ${res.statusCode}`);
      console.log(`${req.method}(${res.statusCode})`, req.originalUrl, `  --  ${dayjs().format("h:mm a")}`);
    });
  }
  next();
});

router.get("/environment", (req, res) => res.send(process.env.NODE_ENV));

// TODO: Secure all Routes with auth

//  api/auth    routes
router.get("/auth/credentials", getUserCredentials);
router.get("/auth/refresh-perms", refreshUserPermission);
router.post("/auth/register", ensureLogout, registerUser);
router.get("/auth/register-confirm/:token", confirmUserAccountFromEmailToken);
router.post("/auth/resend-verification", resendVerificationToUserEmail);
router.post("/auth/forget-password/send-email", resendPasswordResetLinkToUserEmail);
router.post("/auth/forget-password/:token", changePasswordFromEmailToken);
router.post("/auth/login", loginUser);
router.get("/auth/logout", logoutUser);

// /api/listing   routes
router.post("/listing/rent/create", ensureAdmin, uploadMemory.any(), adminCreateRentListingRoute);
router.post("/listing/rent/landlord/create", ensureAuthentication, uploadMemory.any(), landLordSubmitRentListingRoute);
router.get("/listing/rent/search", searchRentListingRoute);
router.get("/listing/sale/search", searchSaleListingRoute);
router.get("/listing/rent/:id", getRentListingById);
router.get("/listing/rent/expanded/:id", getExpandedRentListingById);
router.put("/listing/rent/:id", ensureAuthentication, uploadMemory.any(), updateRentListingById);
router.delete("/listing/rent/:id", ensureAuthentication, deleteRentListingById);
router.get("/listing/listings", ensureAuthentication, landlordViewMyListings);
router.get("/listing/random", getRandomListings);
router.get("/listings", ensureAdmin, getAllListings);
router.get("/listings/approve", ensureAdmin, getApproveFromListings);
router.post("/listing/approve-status", ensureAdmin, setApprovalValueRoute);
router.get("/listing/landlord/my-listings", ensureLandlord, getLandlordListings);

// /api/enquiry   routes
router.post("/enquiry/set-seen", ensureAuthentication, setMessageAsSeen);
router.post("/enquiry/:listingId", ensureAuthentication, createEnquiryRoute);
router.get("/enquiry/latest", ensureAuthentication, getLatestEnquiry);

// /api/message   routes
router.get("/message/enquiry/:enquiryConversationId", ensureAuthentication, getMessagesByEnquiryConversationId);
router.post("/message/enquiry", ensureAuthentication, sendMessageToConversation);

// /api/payments  routes
router.post("/payment/rent/create/monthly-payment-link", ensureAdmin, createNewRentMonthly);
router.post("/payment/rent/attach-landlord", ensureAdmin, adminCreateLandLordForListing);
router.post("/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// feedback
router.post("/feedback/create", submitFeedback);

// user
router.get("/users", ensureAdmin, getAllUsers);

// landlord
router.get("/landlords", ensureAdmin, getAllLandlordsByUser);
router.get("/landlord/profile", ensureAuthentication, getSessionLandlordProfile);

// profile
router.get("/profile/my-profile/", ensureAuthentication, getProfileForLoggedInUser);
router.put("/profile/my-profile/", ensureAuthentication, updateSessionUrsProfile);

export default router;
