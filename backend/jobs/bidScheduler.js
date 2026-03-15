import cron from "node-cron";
import db from "../config/db.js";
import EmailService from "../services/emailService.js";

/*
Testing mode → runs every 5 minutes
Before submission change to:
cron.schedule("0 18 * * *", ...)
*/

cron.schedule("*/5 * * * *", async () => {

  console.log("Running Alumni Winner Selection...");

  try {

    // Prevent duplicate winner insertion
    const [existing] = await db.execute(
      `SELECT * FROM featured_alumni
       WHERE feature_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)`
    );

    if (existing.length > 0) {
      console.log("Winner already selected for tomorrow");
      return;
    }

    // Get highest bid today
    const [rows] = await db.execute(
      `SELECT *
       FROM bids
       WHERE bid_date = CURDATE()
       ORDER BY bid_amount DESC
       LIMIT 1`
    );

    if (rows.length === 0) {
      console.log("No bids today");
      return;
    }

    const winner = rows[0];

    // Save winner for tomorrow's feature
    await db.execute(
      `INSERT INTO featured_alumni
       (profile_id, bid_id, feature_date)
       VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 1 DAY))`,
      [winner.profile_id, winner.id]
    );

    // Get winner email
    const [profile] = await db.execute(
      `SELECT u.email
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [winner.profile_id]
    );

    // Send email
    if (profile.length > 0) {
      await EmailService.sendWinnerNotification(profile[0].email);
    }

    console.log("Winner selected:", winner.profile_id);

  } catch (error) {

    console.error("Scheduler error:", error);

  }

});