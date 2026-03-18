import express from "express";
import CourseController from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Add a short professional course to the alumni profile
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_name:
 *                 type: string
 *                 example: React Advanced Development
 *               provider:
 *                 type: string
 *                 example: Coursera
 *               course_url:
 *                 type: string
 *                 example: https://coursera.org/react-course
 *               completion_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Course added successfully
 */
router.post("/", authMiddleware, CourseController.addCourse);


/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all short professional courses of the logged-in alumni
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of courses
 */
router.get("/", authMiddleware, CourseController.getCourses);


/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update an existing course
 *     tags: [Courses]
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
 *         description: Course updated successfully
 */
router.put("/:id", authMiddleware, CourseController.updateCourse);


/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
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
 *         description: Course deleted successfully
 */
router.delete("/:id", authMiddleware, CourseController.deleteCourse);

export default router;