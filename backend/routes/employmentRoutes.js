import express from "express";
import EmploymentController from "../controllers/employmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /employment:
 *   post:
 *     summary: Add employment history to alumni profile
 *     tags: [Employment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 example: Google
 *               industry:
 *                 type: string
 *                 example: Technology
 *               location:
 *                 type: string
 *                 example: Colombo, Sri Lanka
 *               position:
 *                 type: string
 *                 example: Software Engineer
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-01
 *     responses:
 *       201:
 *         description: Job added successfully
 */
router.post("/", authMiddleware, EmploymentController.addJob);

/**
 * @swagger
 * /employment:
 *   get:
 *     summary: Get employment history for logged-in alumni
 *     tags: [Employment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns employment history
 */
router.get("/", authMiddleware, EmploymentController.getJobs);

/**
 * @swagger
 * /employment/{id}:
 *   put:
 *     summary: Update employment record
 *     tags: [Employment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 example: Google
 *               industry:
 *                 type: string
 *                 example: Finance
 *               location:
 *                 type: string
 *                 example: London, UK
 *               position:
 *                 type: string
 *                 example: Senior Software Engineer
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: 2022-01-01
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *     responses:
 *       200:
 *         description: Job updated successfully
 */
router.put("/:id", authMiddleware, EmploymentController.updateJob);

/**
 * @swagger
 * /employment/{id}:
 *   delete:
 *     summary: Delete employment history entry
 *     tags: [Employment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
router.delete("/:id", authMiddleware, EmploymentController.deleteJob);

export default router;