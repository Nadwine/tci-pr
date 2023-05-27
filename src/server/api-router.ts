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
import { attachMediaToProject, getMediaFromS3Bucket } from "./routes/media";
import { ensureAuthentication, ensureLogout } from "./middlewareFunctions/auth-middleware";
import multer from "multer";
import dayjs from "dayjs";
const memStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memStorage });
const router = express.Router();

// Logger to console log all api routes called;
router.use("*", (req: Request, res: Response, next: NextFunction) => {
  // If it is an image or video or static asset we will ignore url log
  // will log too many times 1 page can load multiple images
  const isAsset = req.rawHeaders.filter(h => h.includes("image") || h.includes("video")).length > 0;

  // "/api/auth/credentials & refresh-perms is called too many times"
  if (!isAsset && req.originalUrl !== "/api/auth/credentials" && req.originalUrl !== "/api/auth/refresh-perms") {
    console.log(req.method, req.originalUrl, `  --  ${dayjs().format("h:mm a")}`);
  }
  next();
});

//  api/auth  routes
router.get("/auth/credentials", getUserCredentials);
router.get("/auth/refresh-perms", refreshUserPermission);
router.post("/auth/register", ensureLogout, registerUser);
router.get("/auth/register-confirm/:token", confirmUserAccountFromEmailToken);
router.post("/auth/resend-verification", resendVerificationToUserEmail);
router.post("/auth/login", loginUser);
router.get("/auth/logout", logoutUser);

// api/media  routes
router.post("/media/attach", ensureAuthentication, uploadMemory.any(), attachMediaToProject);
router.get("/media/:visibility/:userId/:projectId/:filename", getMediaFromS3Bucket);

export default router;
