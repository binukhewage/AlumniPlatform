import express from "express";
import ApiKeyController from "../controllers/apiKeyController.js";

const router = express.Router();

/**
 * @swagger
 * /api-keys:
 *   post:
 *     summary: Generate a new API key
 *     tags: [API Keys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *                 example: AR App
 *               permissions:
 *                 type: string
 *                 example: read:alumni,read:alumni_of_day
 *     responses:
 *       201:
 *         description: API key generated successfully
 */
router.post("/", ApiKeyController.createKey);


/**
 * @swagger
 * /api-keys:
 *   get:
 *     summary: Get all API keys
 *     tags: [API Keys]
 *     responses:
 *       200:
 *         description: List of API keys
 */
router.get("/", ApiKeyController.getKeys);


/**
 * @swagger
 * /api-keys/{id}/revoke:
 *   put:
 *     summary: Revoke an API key
 *     tags: [API Keys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API Key ID
 *     responses:
 *       200:
 *         description: API key revoked successfully
 */
router.put("/:id/revoke", ApiKeyController.revokeKey);

/**
 * @swagger
 * /api-keys/{id}/stats:
 *   get:
 *     summary: Get API key statistics
 *     tags: [API Keys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: API key statistics retrieved successfully
 */
router.get("/:id/stats", ApiKeyController.getKeyStats);

export default router;