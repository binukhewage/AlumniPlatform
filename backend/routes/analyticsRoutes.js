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

/**
 * @swagger
 * /analytics/top-employers:
 *   get:
 *     summary: Get top employers
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Top employers returned successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/top-employers",
    AnalyticsController.getTopEmployers
  );
  
  /**
   * @swagger
   * /analytics/job-titles:
   *   get:
   *     summary: Get most common job titles
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Job titles returned successfully
   *       500:
   *         description: Server error
   */
  router.get(
    "/job-titles",
    AnalyticsController.getJobTitles
  );
  
  /**
   * @swagger
   * /analytics/growth:
   *   get:
   *     summary: Get alumni growth over time
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Growth data returned successfully
   *       500:
   *         description: Server error
   */
  router.get(
    "/growth",
    AnalyticsController.getGrowthOverTime
  );
  
  /**
   * @swagger
   * /analytics/degrees:
   *   get:
   *     summary: Get degree distribution
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Degree distribution returned successfully
   *       500:
   *         description: Server error
   */
  router.get(
    "/degrees",
    AnalyticsController.getDegreeDistribution
  );

  /**
 * @swagger
 * /analytics/skills-gap:
 *   get:
 *     summary: Get skills gap radar data
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Skills gap data returned successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/skills-gap",
    AnalyticsController.getSkillsGap
  );
  
  /**
   * @swagger
   * /analytics/graduation-years:
   *   get:
   *     summary: Get alumni by graduation year
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Graduation year data returned successfully
   *       500:
   *         description: Server error
   */
  router.get(
    "/graduation-years",
    AnalyticsController.getGraduationYears
  );
  
  /**
   * @swagger
   * /analytics/sector-demand:
   *   get:
   *     summary: Get sector demand statistics
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Sector demand data returned successfully
   *       500:
   *         description: Server error
   */
  router.get(
    "/sector-demand",
    AnalyticsController.getSectorDemand
  );
  
  /**
   * @swagger
   * /analytics/courses-popularity:
   *   get:
   *     summary: Get popular courses data
   *     tags: [Analytics]
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