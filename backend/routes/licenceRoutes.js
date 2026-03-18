import express from "express";
import LicenceController from "../controllers/licenceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /licences:
 *   post:
 *     summary: Add a professional licence to the alumni profile
 *     tags: [Licences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licence_name:
 *                 type: string
 *                 example: Chartered Engineer
 *               authority:
 *                 type: string
 *                 example: Engineering Council
 *               licence_url:
 *                 type: string
 *                 example: https://engc.org.uk
 *               completion_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Licence added successfully
 */
router.post("/", authMiddleware, LicenceController.addLicence);


/**
 * @swagger
 * /licences:
 *   get:
 *     summary: Get all professional licences of the logged-in alumni
 *     tags: [Licences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of licences
 */
router.get("/", authMiddleware, LicenceController.getLicences);


/**
 * @swagger
 * /licences/{id}:
 *   put:
 *     summary: Update a professional licence
 *     tags: [Licences]
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
 *         description: Licence updated successfully
 */
router.put("/:id", authMiddleware, LicenceController.updateLicence);


/**
 * @swagger
 * /licences/{id}:
 *   delete:
 *     summary: Delete a professional licence
 *     tags: [Licences]
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
 *         description: Licence deleted successfully
 */
router.delete("/:id", authMiddleware, LicenceController.deleteLicence);

export default router;