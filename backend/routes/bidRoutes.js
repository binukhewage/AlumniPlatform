import express from "express";
import BidController from "../controllers/bidController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/",authMiddleware,BidController.placeBid);
router.put("/:id",authMiddleware,BidController.updateBid);
router.get("/my-bid", authMiddleware, BidController.getMyBid);

export default router;