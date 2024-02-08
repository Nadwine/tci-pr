import express, { NextFunction, Request, Response } from "express";
import { validate } from "express-yup";
import {
  confirmUserAccountFromEmailToken,
  getUserCredentials,
  loginUser,
  logoutUser,
  refreshUserPermission,
  registerUser,
  resendVerificationToUserEmail
} from "./routes/auth";
import { ensureAuthentication, ensureLogout } from "./middlewareFunctions/auth-middleware";
import multer from "multer";
import dayjs from "dayjs";
import {
  createRentListingRoute,
  createSaleListingRoute,
  deleteRentListingById,
  getRentListingById,
  landlordViewMyListings,
  searchRentListingRoute,
  searchSaleListingRoute,
  updateRentListingById
} from "./routes/listing-route";
import { createEnquiryRoute, getLatestEnquiry } from "./routes/enquiry-route";
import { getMessagesByEnquiryConversationId, sendMessageToConversation } from "./routes/message-chat-route";
import { createNewRentMonthly, stripeWebhook } from "./routes/payments";
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
    console.log(req.method, req.originalUrl, `  --  ${dayjs().format("h:mm a")}`);
  }
  next();
});

// TODO: Secure all Routes with auth

//  api/auth    routes
router.get("/auth/credentials", getUserCredentials);
router.get("/auth/refresh-perms", refreshUserPermission);
router.post("/auth/register", ensureLogout, registerUser);
router.get("/auth/register-confirm/:token", confirmUserAccountFromEmailToken);
router.post("/auth/resend-verification", resendVerificationToUserEmail);
router.post("/auth/login", loginUser);
router.get("/auth/logout", logoutUser);

// /api/listing   routes
router.post("/listing/rent/create", ensureAuthentication, uploadMemory.any(), createRentListingRoute);
router.post("/listing/sale/create", ensureAuthentication, uploadMemory.any(), createSaleListingRoute);
router.get("/listing/rent/search", searchRentListingRoute);
router.get("/listing/sale/search", searchSaleListingRoute);
router.get("/listing/rent/:id", getRentListingById);
router.put("/listing/rent/:id", ensureAuthentication, uploadMemory.any(), updateRentListingById);
router.delete("/listing/rent/:id", ensureAuthentication, deleteRentListingById);
router.get("/listing/listings", ensureAuthentication, landlordViewMyListings);

// /api/enquiry   routes
router.post("/enquiry/:listingId", ensureAuthentication, createEnquiryRoute);
router.get("/enquiry/latest", ensureAuthentication, getLatestEnquiry);

// /api/message   routes
router.get("/message/enquiry/:enquiryConversationId", ensureAuthentication, getMessagesByEnquiryConversationId);
router.post("/message/enquiry", ensureAuthentication, sendMessageToConversation);

// /api/payments  routes
router.post("/payment/single-payment/:listingId", ensureAuthentication, createNewRentMonthly);
router.post("/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
