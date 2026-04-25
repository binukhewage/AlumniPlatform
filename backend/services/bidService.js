import db from "../config/db.js";
import BidModel from "../models/bidModel.js";
import EmailService from "./emailService.js";

class BidService {

  // Determine which auction date the bid belongs to
  // If after 6 PM → assign to next day
  static getAuctionDate() {
    const now = new Date();
    const hour = now.getHours();

    const bidDateObj = new Date(now);

    if (hour >= 18) {
      bidDateObj.setDate(bidDateObj.getDate() + 1);
    }

    // Format as YYYY-MM-DD
    const year = bidDateObj.getFullYear();
    const month = String(bidDateObj.getMonth() + 1).padStart(2, "0");
    const day = String(bidDateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // ---------------- PLACE BID ----------------
  static async placeBid(userId, amount) {

    const bidDate = this.getAuctionDate();

    // Get profile + email (needed for bidding + notifications)
    const [profile] = await db.execute(
      `SELECT p.id, u.email
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = ?`,
      [userId],
    );

    if (!profile.length) throw new Error("Profile not found");

    const profileId = profile[0].id;
    const email = profile[0].email;

    // Limit: max 3 wins per month
    const monthlyWins = await BidModel.getMonthlyWins(profileId);
    if (monthlyWins >= 3) throw new Error("Monthly feature limit reached");

    // Only ONE active bid per user per day
    const existingBid = await BidModel.getBidByProfile(profileId, bidDate);
    if (existingBid) {
      throw new Error("You already have an active bid. Update or cancel it.");
    }

    // if no active bid Insert new bid
    const bidId = await BidModel.createBid(profileId, amount, bidDate);

    // ---------------- STATUS LOGIC ----------------
    
    // Get all active bids (sorted highest → lowest)
    const allBids = await BidModel.getAllActiveBids(bidDate);

    if (allBids.length === 1) {

      // if there's no other bids set to winning
      await db.execute(
        `UPDATE bids SET status = 'winning' WHERE id = ?`,
        [allBids[0].id]
      );

    } else {

      // Multiple bids → determine highest
      const highest = allBids[0];

      await db.execute(
        `UPDATE bids
         SET status = 'losing'
         WHERE bid_date = ?
         AND status != 'cancelled'`,
        [bidDate]
      );

      await db.execute(
        `UPDATE bids SET status = 'winning' WHERE id = ?`,
        [highest.id]
      );
    }

    // Highest as winning
    const [updatedBid] = await db.execute(
      `SELECT status FROM bids WHERE id = ?`,
      [bidId]
    );

    // Get final status of this bid
    const finalStatus = updatedBid[0]?.status;

    if (!finalStatus) throw new Error("Failed to determine bid status");

    // Send email notification
    await EmailService.sendBidStatus(email, finalStatus);

    return { status: finalStatus };
  }

  // ---------------- UPDATE BID ----------------
  static async updateBid(userId, bidId, newAmount) {

    const bidDate = this.getAuctionDate();

    const [profile] = await db.execute(
      `SELECT id FROM profiles WHERE user_id = ?`,
      [userId],
    );

    const profileId = profile[0].id;

    const currentBid = await BidModel.getBidByProfile(profileId, bidDate);

    if (!currentBid) throw new Error("No existing bid found");

    // New bid must be higher
    if (newAmount <= currentBid.bid_amount) {
      throw new Error("Bid must be higher than previous");
    }

    // Update bid amount
    await BidModel.updateBid(bidId, newAmount);

    // Recalculate statuses
    const allBids = await BidModel.getAllActiveBids(bidDate);

    if (allBids.length === 1) {

      await db.execute(
        `UPDATE bids SET status = 'winning' WHERE id = ?`,
        [allBids[0].id]
      );

    } else {

      const highest = allBids[0];

      await db.execute(
        `UPDATE bids
         SET status = 'losing'
         WHERE bid_date = ?
         AND status != 'cancelled'`,
        [bidDate]
      );

      await db.execute(
        `UPDATE bids SET status = 'winning' WHERE id = ?`,
        [highest.id]
      );
    }

    // Get final status of this bid
    const [updatedBid] = await db.execute(
      `SELECT status FROM bids WHERE id = ?`,
      [bidId]
    );

    const finalStatus = updatedBid[0]?.status;

    return { status: finalStatus };
  }

  // ---------------- GET CURRENT BID ----------------
  static async getMyBid(userId) {

    const bidDate = this.getAuctionDate();

    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId],
    );

    if (!profile.length) return { message: "No active bid" };

    const bid = await BidModel.getBidByProfile(profile[0].id, bidDate);

    if (!bid) return { message: "No active bid" };

    return bid;
  }

  // ---------------- HISTORY ----------------
  static async getBidHistory(userId) {

    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id = ?",
      [userId]
    );

    if (!profile.length) return [];

    const profileId = profile[0].id;

    const [rows] = await db.execute(
      `SELECT 
         id,
         bid_amount,
         status,
         DATE_FORMAT(bid_date, '%Y-%m-%d') AS bid_date
       FROM bids
       WHERE profile_id = ?
       ORDER BY bid_date DESC`,
      [profileId]
    );

    return rows;
  }

  // ---------------- CANCEL ----------------
  static async cancelBid(userId, bidId) {

    const bidDate = this.getAuctionDate();

    const [profile] = await db.execute(
      `SELECT id FROM profiles WHERE user_id = ?`,
      [userId],
    );

    const profileId = profile[0].id;

    const bid = await BidModel.getBidByProfile(profileId, bidDate);

    if (!bid || bid.id != bidId) {
      throw new Error("Bid not found");
    }

    // Mark bid as cancelled
    await db.execute(
      `UPDATE bids SET status = 'cancelled' WHERE id = ?`,
      [bidId]
    );

    // Recalculate remaining bids
    const allBids = await BidModel.getAllActiveBids(bidDate);

    if (allBids.length === 1) {

      await db.execute(
        `UPDATE bids SET status = 'winning' WHERE id = ?`,
        [allBids[0].id]
      );

    } else if (allBids.length > 1) {

      const highest = allBids[0];

      await db.execute(
        `UPDATE bids
         SET status = 'losing'
         WHERE bid_date = ?
         AND status != 'cancelled'`,
        [bidDate]
      );

      await db.execute(
        `UPDATE bids SET status = 'winning' WHERE id = ?`,
        [highest.id]
      );
    }

    return { message: "Bid cancelled successfully" };
  }
}

export default BidService;