import express from "express";
import LicenceController from "../controllers/licenceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",authMiddleware,LicenceController.addLicence);

router.get("/",authMiddleware,LicenceController.getLicences);

router.put("/:id",authMiddleware,LicenceController.updateLicence);

router.delete("/:id",authMiddleware,LicenceController.deleteLicence);

export default router;