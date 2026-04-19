import express from "express";
import AnalyticsController from "../controllers/analyticsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: University analytics dashboard endpoints
 */

/**
 * @swagger
 * /analytics/summary:
 *   get:
 *     summary: Get dashboard summary statistics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Summary data returned successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get("/summary", AnalyticsController.getSummary);

/**
 * @swagger
 * /analytics/employment-sectors:
 *   get:
 *     summary: Get employment sector statistics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Employment sector data returned successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get(
  "/employment-sectors",
  AnalyticsController.getEmploymentSectors
);

/**
 * @swagger
 * /analytics/certifications:
 *   get:
 *     summary: Get certification statistics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Certification data returned successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get(
  "/certifications",
  AnalyticsController.getCertifications
);

export default router;