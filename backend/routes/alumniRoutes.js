import express from "express";
import AlumniController from "../controllers/alumniController.js";

const router = express.Router();

/**
 * @swagger
 * /alumni:
 *   get:
 *     summary: Get all alumni profiles
 *     tags: [Alumni]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Alumni list returned successfully
 */
router.get("/", AlumniController.getAll);

export default router;