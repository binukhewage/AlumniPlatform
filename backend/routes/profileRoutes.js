import express from "express";
import ProfileController from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Create an alumni profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: John Smith
 *               bio:
 *                 type: string
 *                 example: Software engineer passionate about cloud technologies
 *               linkedin_url:
 *                 type: string
 *                 example: https://linkedin.com/in/johnsmith
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile created successfully
 */
router.post(
  "/",
  authMiddleware,
  upload.single("profile_image"),
  ProfileController.createProfile
);


/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the logged-in alumni profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns alumni profile information
 */
router.get(
  "/",
  authMiddleware,
  ProfileController.getProfile
);


/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update alumni profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               bio:
 *                 type: string
 *               linkedin_url:
 *                 type: string
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put(
  "/",
  authMiddleware,
  upload.single("profile_image"),
  ProfileController.updateProfile
);


/**
 * @swagger
 * /profile:
 *   delete:
 *     summary: Delete alumni profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 */
router.delete(
  "/",
  authMiddleware,
  ProfileController.deleteProfile
);

export default router;