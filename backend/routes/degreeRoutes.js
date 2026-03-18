import express from "express";
import DegreeController from "../controllers/degreeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /degrees:
 *   post:
 *     summary: Add a university degree to the alumni profile
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               degree_name:
 *                 type: string
 *                 example: BSc Computer Science
 *               university:
 *                 type: string
 *                 example: University of Eastminster
 *               degree_url:
 *                 type: string
 *                 example: https://eastminster.ac.uk/bsc-compsci
 *               completion_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Degree added successfully
 */
router.post("/", authMiddleware, DegreeController.addDegree);


/**
 * @swagger
 * /degrees:
 *   get:
 *     summary: Get all degrees of the logged-in alumni
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of degrees
 */
router.get("/", authMiddleware, DegreeController.getDegrees);


/**
 * @swagger
 * /degrees/{id}:
 *   put:
 *     summary: Update a degree
 *     tags: [Degrees]
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
 *         description: Degree updated successfully
 */
router.put("/:id", authMiddleware, DegreeController.updateDegree);


/**
 * @swagger
 * /degrees/{id}:
 *   delete:
 *     summary: Delete a degree
 *     tags: [Degrees]
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
 *         description: Degree deleted successfully
 */
router.delete("/:id", authMiddleware, DegreeController.deleteDegree);

export default router;