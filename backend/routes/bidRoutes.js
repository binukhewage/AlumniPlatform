import express from "express";
import BidController from "../controllers/bidController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /bids:
 *   post:
 *     summary: Place a blind bid for Alumni of the Day
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bid_amount
 *             properties:
 *               bid_amount:
 *                 type: number
 *                 example: 250
 *     responses:
 *       201:
 *         description: Bid placed successfully
 *       400:
 *         description: Validation error
 */
router.post("/", authMiddleware, BidController.placeBid);


/**
 * @swagger
 * /bids/{id}:
 *   put:
 *     summary: Increase an existing bid (must be higher than previous bid)
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bid ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bid_amount
 *             properties:
 *               bid_amount:
 *                 type: number
 *                 example: 400
 *     responses:
 *       200:
 *         description: Bid updated successfully
 *       400:
 *         description: New bid must be higher than previous bid
 */
router.put("/:id", authMiddleware, BidController.updateBid);


/**
 * @swagger
 * /bids/my-bid:
 *   get:
 *     summary: Get the current user's bid and status
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user's bid information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 bid_amount:
 *                   type: number
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: active
 */
router.get("/my-bid", authMiddleware, BidController.getMyBid);

export default router;