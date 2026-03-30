import db from "../config/db.js";

class BidModel {

  static async createBid(profileId, amount, bidDate) {
    const [result] = await db.execute(
      `INSERT INTO bids (profile_id, bid_amount, bid_date, status)
       VALUES (?, ?, ?, 'losing')`,
      [profileId, amount, bidDate]
    );

    return result.insertId;
  }

  static async updateBid(id, amount) {
    await db.execute(
      `UPDATE bids SET bid_amount=? WHERE id=?`,
      [amount, id]
    );
  }

  // Get the highest bid for a specific date
  // If tie → earliest created_at wins 
  static async getHighestBid(bidDate) {
    const [rows] = await db.execute(
      `SELECT *
       FROM bids
       WHERE bid_date = ?
       AND status != 'cancelled'
       ORDER BY bid_amount DESC, created_at ASC
       LIMIT 1`,
      [bidDate]
    );

    return rows[0];
  }

  static async getBidByProfile(profileId, bidDate) {
    const [rows] = await db.execute(
      `SELECT *
       FROM bids
       WHERE profile_id = ?
       AND bid_date = ?
       AND status != 'cancelled'
       ORDER BY created_at DESC
       LIMIT 1`,
      [profileId, bidDate]
    );

    return rows[0];
  }

  static async getAllActiveBids(bidDate) {
    const [rows] = await db.execute(
      `SELECT *
       FROM bids
       WHERE bid_date = ?
       AND status != 'cancelled'
       ORDER BY bid_amount DESC, created_at ASC`,
      [bidDate]
    );

    return rows;
  }

  // Count how many times a user has won in current month
  // Used to enforce monthly limit (max 3 wins)
  static async getMonthlyWins(profileId) {
    const [rows] = await db.execute(
      `SELECT COUNT(*) AS wins
       FROM featured_alumni
       WHERE profile_id=?
       AND MONTH(feature_date)=MONTH(CURRENT_DATE())`,
      [profileId]
    );

    return rows[0].wins;
  }

}

export default BidModel;