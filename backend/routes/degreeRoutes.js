import express from "express";
import DegreeController from "../controllers/degreeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, DegreeController.addDegree);

router.get("/", authMiddleware, DegreeController.getDegrees);

router.put("/:id", authMiddleware, DegreeController.updateDegree);

router.delete("/:id", authMiddleware, DegreeController.deleteDegree);

export default router;