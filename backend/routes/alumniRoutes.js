import express from "express";
import AlumniController from "../controllers/alumniController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /alumni:
 *   get:
 *     summary: Get all alumni profiles
 *     tags: [Alumni]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alumni list returned successfully
 */
router.get("/", authMiddleware, AlumniController.getAll);

export default router;