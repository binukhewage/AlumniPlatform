import express from "express";
import ProfileController from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("profile_image"),
  ProfileController.createProfile
);

router.get(
  "/",
  authMiddleware,
  ProfileController.getProfile
);

router.put(
  "/",
  authMiddleware,
  upload.single("profile_image"),
  ProfileController.updateProfile
);

router.delete(
  "/",
  authMiddleware,
  ProfileController.deleteProfile
);

export default router;