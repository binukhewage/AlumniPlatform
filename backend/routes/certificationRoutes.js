import express from "express";
import CertificationController from "../controllers/certificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /certifications:
 *   post:
 *     summary: Add a professional certification to the alumni profile
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - certification_name
 *             properties:
 *               certification_name:
 *                 type: string
 *                 example: AWS Certified Developer
 *               organisation:
 *                 type: string
 *                 example: Amazon
 *               cert_url:
 *                 type: string
 *                 example: https://aws.amazon.com
 *               completion_date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *     responses:
 *       201:
 *         description: Certification added successfully
 */
router.post("/", authMiddleware, CertificationController.addCertification);


/**
 * @swagger
 * /certifications:
 *   get:
 *     summary: Get all certifications for the logged-in alumni
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of certifications
 */
router.get("/", authMiddleware, CertificationController.getCertifications);


/**
 * @swagger
 * /certifications/{id}:
 *   put:
 *     summary: Update an existing certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certification_name:
 *                 type: string
 *               organisation:
 *                 type: string
 *               cert_url:
 *                 type: string
 *               completion_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Certification updated
 */
router.put("/:id", authMiddleware, CertificationController.updateCertification);


/**
 * @swagger
 * /certifications/{id}:
 *   delete:
 *     summary: Delete a certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Certification deleted successfully
 */
router.delete("/:id", authMiddleware, CertificationController.deleteCertification);

export default router;