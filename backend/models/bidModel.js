import db from "../config/db.js";

class BidModel {

  static async createBid(profileId, amount) {
    const [result] = await db.execute(
      `INSERT INTO bids (profile_id, bid_amount, bid_date)
       VALUES (?, ?, CURDATE())`,
      [profileId, amount]
    );

    return result.insertId;
  }

  static async updateBid(id, amount) {
    await db.execute(
      `UPDATE bids SET bid_amount=? WHERE id=?`,
      [amount, id]
    );
  }

  static async getHighestBid() {
    const [rows] = await db.execute(
      `SELECT *
       FROM bids
       WHERE bid_date = CURDATE()
       AND (status IS NULL OR status != 'cancelled')
       ORDER BY bid_amount DESC, created_at DESC
       LIMIT 1`
    );
  
    return rows[0];
  }

  static async setStatus(id, status) {
    await db.execute(
      `UPDATE bids SET status=? WHERE id=?`,
      [status, id]
    );
  }

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

  // FIX: latest + exclude cancelled
  static async getBidByProfile(profileId) {
    const [rows] = await db.execute(
      `SELECT 
         id,
         profile_id,
         bid_amount,
         status,
         DATE_FORMAT(bid_date, '%Y-%m-%d') AS bid_date,
         created_at
       FROM bids
       WHERE profile_id = ?
       AND bid_date = CURDATE()
       AND status != 'cancelled'
       ORDER BY created_at DESC
       LIMIT 1`,
      [profileId]
    );
  
    return rows[0];
  }

}

export default BidModel;