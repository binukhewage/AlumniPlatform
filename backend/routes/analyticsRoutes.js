// routes/analyticsRoutes.js

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
 * /analytics/filter-options:
 *   get:
 *     summary: Get dashboard filter options
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Filter options returned successfully
 *       500:
 *         description: Server error
 */
router.get("/filter-options", AnalyticsController.getFilterOptions);

/**
 * @swagger
 * /analytics/summary:
 *   get:
 *     summary: Get dashboard summary cards
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Summary data returned successfully
 *       500:
 *         description: Server error
 */
router.get("/summary", AnalyticsController.getSummary);

/**
 * @swagger
 * /analytics/skills-gap:
 *   get:
 *     summary: Get curriculum skill gap radar chart data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Skills gap data returned successfully
 *       500:
 *         description: Server error
 */
router.get("/skills-gap", AnalyticsController.getSkillsGap);

/**
 * @swagger
 * /analytics/employment-sectors:
 *   get:
 *     summary: Get employment by industry sector chart data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Employment sector data returned successfully
 *       500:
 *         description: Server error
 */
router.get(
  "/employment-sectors",
  AnalyticsController.getEmploymentSectors
);

/**
 * @swagger
 * /analytics/job-titles:
 *   get:
 *     summary: Get most common alumni job titles
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Job titles returned successfully
 *       500:
 *         description: Server error
 */
router.get("/job-titles", AnalyticsController.getJobTitles);

/**
 * @swagger
 * /analytics/top-employers:
 *   get:
 *     summary: Get top employers hiring alumni
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Top employers returned successfully
 *       500:
 *         description: Server error
 */
router.get("/top-employers", AnalyticsController.getTopEmployers);

/**
 * @swagger
 * /analytics/geographic-distribution:
 *   get:
 *     summary: Get geographic distribution of alumni
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Geographic data returned successfully
 *       500:
 *         description: Server error
 */
router.get(
  "/geographic-distribution",
  AnalyticsController.getGeographicDistribution
);

/**
 * @swagger
 * /analytics/sector-demand:
 *   get:
 *     summary: Get industry demand by sector
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Sector demand data returned successfully
 *       500:
 *         description: Server error
 */
router.get("/sector-demand", AnalyticsController.getSectorDemand);

/**
 * @swagger
 * /analytics/certifications:
 *   get:
 *     summary: Get certification growth trend data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Certification data returned successfully
 *       500:
 *         description: Server error
 */
router.get("/certifications", AnalyticsController.getCertifications);

/**
 * @swagger
 * /analytics/courses-popularity:
 *   get:
 *     summary: Get professional development courses popularity
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *         ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Course popularity data returned successfully
 *       500:
 *         description: Server error
 */
router.get(
  "/courses-popularity",
  AnalyticsController.getCoursesPopularity
);

export default router;