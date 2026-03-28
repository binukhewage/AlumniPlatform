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
 *       - ApiKeyAuth: []
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
 *       - ApiKeyAuth: []
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
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Returns user's current bid
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
 *                   example: winning
 */
router.get("/my-bid", authMiddleware, BidController.getMyBid);


/**
 * @swagger
 * /bids/history:
 *   get:
 *     summary: Get user's bidding history (one record per day)
 *     description: Returns all past bids placed by the user. Each day contains only one bid record since updates overwrite the same day's bid.
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of past bids
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bid_amount:
 *                     type: number
 *                     example: 300
 *                   status:
 *                     type: string
 *                     example: losing
 *                   bid_date:
 *                     type: string
 *                     example: 2026-03-28
 */
router.get("/history", authMiddleware, BidController.getBidHistory);

/**
 * @swagger
 * /bids/{id}:
 *   delete:
 *     summary: Cancel (delete) today's bid
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bid cancelled successfully
 */
router.delete("/:id", authMiddleware, BidController.cancelBid);

export default router;