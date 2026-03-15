import db from "../config/db.js";
import BidModel from "../models/bidModel.js";
import EmailService from "./emailService.js";

class BidService {

  static async placeBid(userId, amount) {

    const [profile] = await db.execute(
      `SELECT p.id, u.email
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = ?`,
      [userId]
    );

    if (!profile.length) {
      throw new Error("Profile not found");
    }

    const profileId = profile[0].id;
    const email = profile[0].email;

    // Monthly limit check
    const monthlyWins = await BidModel.getMonthlyWins(profileId);

    if (monthlyWins >= 3) {
      throw new Error("Monthly feature limit reached");
    }

    // Prevent multiple bids per day
    const existingBid = await BidModel.getBidByProfile(profileId);

    if (existingBid) {
      throw new Error("You already placed a bid today");
    }

    // Insert bid
    const bidId = await BidModel.createBid(profileId, amount);

    // Determine highest bid (tie → earliest wins)
    const highestBid = await BidModel.getHighestBid();

    // Reset all bids today to losing
    await db.execute(
      `UPDATE bids
       SET status = 'losing'
       WHERE bid_date = CURDATE()`
    );

    // Set highest bid as winning
    await db.execute(
      `UPDATE bids
       SET status = 'winning'
       WHERE id = ?`,
      [highestBid.id]
    );

    const status = highestBid.id === bidId ? "winning" : "losing";

    await EmailService.sendBidStatus(email, status);

    return { status };
  }


  static async updateBid(userId, bidId, newAmount) {

    const [profile] = await db.execute(
      `SELECT p.id, u.email
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = ?`,
      [userId]
    );

    if (!profile.length) {
      throw new Error("Profile not found");
    }

    const profileId = profile[0].id;
    const email = profile[0].email;

    const currentBid = await BidModel.getBidByProfile(profileId);

    if (!currentBid) {
      throw new Error("No existing bid found");
    }

    if (newAmount <= currentBid.bid_amount) {
      throw new Error("Bid must be higher than previous");
    }

    await BidModel.updateBid(bidId, newAmount);

    // Determine new highest bid
    const highestBid = await BidModel.getHighestBid();

    // Reset all bids today
    await db.execute(
      `UPDATE bids
       SET status = 'losing'
       WHERE bid_date = CURDATE()`
    );

    // Set winner
    await db.execute(
      `UPDATE bids
       SET status = 'winning'
       WHERE id = ?`,
      [highestBid.id]
    );

    const status = highestBid.id === bidId ? "winning" : "losing";

    await EmailService.sendBidStatus(email, status);

    return { status };
  }
  
  static async getMyBid(userId){

    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId]
    );
  
    if(!profile.length){
      return null;
    }
  
    const profileId = profile[0].id;
  
    const bid = await BidModel.getBidByProfile(profileId);
  
    return bid;
  
  }
}

export default BidService;