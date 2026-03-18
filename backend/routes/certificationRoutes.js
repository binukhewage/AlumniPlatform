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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 */
router.delete("/:id", authMiddleware, CertificationController.deleteCertification);

export default router;