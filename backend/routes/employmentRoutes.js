import express from "express";
import EmploymentController from "../controllers/employmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, EmploymentController.addJob);

router.get("/", authMiddleware, EmploymentController.getJobs);

router.put("/:id", authMiddleware, EmploymentController.updateJob);

router.delete("/:id", authMiddleware, EmploymentController.deleteJob);

export default router;