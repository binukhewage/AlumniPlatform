import express from "express";
import CourseController from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, CourseController.addCourse);

router.get("/", authMiddleware, CourseController.getCourses);

router.put("/:id", authMiddleware, CourseController.updateCourse);

router.delete("/:id", authMiddleware, CourseController.deleteCourse);

export default router;