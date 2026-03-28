import db from "../config/db.js";
import BidModel from "../models/bidModel.js";
import EmailService from "./emailService.js";

class BidService {
  // PLACE BID
  static async placeBid(userId, amount) {
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

    // Monthly limit
    const monthlyWins = await BidModel.getMonthlyWins(profileId);
    if (monthlyWins >= 3) throw new Error("Monthly feature limit reached");

    // Only ONE ACTIVE bid
    const existingBid = await BidModel.getBidByProfile(profileId);
    if (existingBid) {
      throw new Error("You already have an active bid. Update or cancel it.");
    }

    // Insert
    const bidId = await BidModel.createBid(profileId, amount);

    // FIX: reset ONLY active bids
    await db.execute(
      `UPDATE bids
       SET status = 'losing'
       WHERE bid_date = CURDATE()
       AND status IN ('winning','losing')`,
    );

    const highestBid = await BidModel.getHighestBid();

    if (highestBid) {
      await db.execute(`UPDATE bids SET status = 'winning' WHERE id = ?`, [
        highestBid.id,
      ]);
    }

    const [updatedBid] = await db.execute(
      `SELECT status FROM bids WHERE id = ?`,
      [bidId],
    );

    const finalStatus = updatedBid[0]?.status;

    if (!finalStatus) {
      throw new Error("Failed to determine bid status");
    }

    await EmailService.sendBidStatus(email, finalStatus);

    return { status: finalStatus };
  }

  // UPDATE BID
  static async updateBid(userId, bidId, newAmount) {
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

    const currentBid = await BidModel.getBidByProfile(profileId);

    if (!currentBid) throw new Error("No existing bid found");

    if (newAmount <= currentBid.bid_amount) {
      throw new Error("Bid must be higher than previous");
    }

    await BidModel.updateBid(bidId, newAmount);

    // FIX: reset ONLY active bids
    await db.execute(
      `UPDATE bids
       SET status = 'losing'
       WHERE bid_date = CURDATE()
       AND status IN ('winning','losing')`,
    );

    const highestBid = await BidModel.getHighestBid();

    if (highestBid) {
      await db.execute(`UPDATE bids SET status = 'winning' WHERE id = ?`, [
        highestBid.id,
      ]);
    }

    const [updatedBid] = await db.execute(
      `SELECT status FROM bids WHERE id = ?`,
      [bidId],
    );

    const finalStatus = updatedBid[0].status;

    await EmailService.sendBidStatus(email, finalStatus);

    return { status: finalStatus };
  }

  // GET CURRENT BID
  static async getMyBid(userId) {
    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId],
    );

    if (!profile.length) {
      return { message: "No active bid" };
    }

    const profileId = profile[0].id;

    const bid = await BidModel.getBidByProfile(profileId);

    if (!bid) return { message: "No active bid" };

    if (bid.status === "won" || bid.status === "lost") {
      return {
        message: "Bidding closed",
        result: bid.status,
      };
    }

    return bid;
  }

  // HISTORY
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

  // CANCEL BID (FIXED PROPERLY)
  static async cancelBid(userId, bidId) {
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

    const [bid] = await db.execute(
      `SELECT * FROM bids WHERE id = ? AND profile_id = ?`,
      [bidId, profileId],
    );

    if (!bid.length) throw new Error("Bid not found");

    const currentBid = bid[0];

    if (
      new Date(currentBid.bid_date).toDateString() !== new Date().toDateString()
    ) {
      throw new Error("You can only cancel today's bid");
    }

    if (currentBid.status === "won" || currentBid.status === "lost") {
      throw new Error("Cannot cancel a finalized bid");
    }

    // STEP 1: mark cancelled
    await db.execute(`UPDATE bids SET status = 'cancelled' WHERE id = ?`, [
      bidId,
    ]);

    //  STEP 2: reset ONLY active bids
    await db.execute(
      `UPDATE bids
       SET status = 'losing'
       WHERE bid_date = CURDATE()
       AND status IN ('winning','losing')`,
    );

    const highestBid = await BidModel.getHighestBid();

    if (highestBid) {
      await db.execute(`UPDATE bids SET status = 'winning' WHERE id = ?`, [
        highestBid.id,
      ]);
    }

    await EmailService.sendBidStatus(email, "cancelled");

    return { message: "Bid cancelled successfully" };
  }
}

export default BidService;
