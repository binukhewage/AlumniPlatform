import express from "express";
import CertificationController from "../controllers/certificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",authMiddleware,CertificationController.addCertification);
router.get("/",authMiddleware,CertificationController.getCertifications);
router.delete("/:id",authMiddleware,CertificationController.deleteCertification);

export default router;