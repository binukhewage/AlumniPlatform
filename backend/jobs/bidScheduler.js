import cron from "node-cron";
import db from "../config/db.js";
import EmailService from "../services/emailService.js";

cron.schedule("0 18 * * *", async () => {

  console.log("Running Alumni Winner Selection...");

  try {

    //  Prevent duplicate winner insertion
    const [existing] = await db.execute(
      `SELECT * FROM featured_alumni
       WHERE feature_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)`
    );

    if (existing.length > 0) {
      console.log("Winner already selected for tomorrow");
      return;
    }

    // Get all valid bids (exclude cancelled)
    const [bids] = await db.execute(
      `SELECT *
       FROM bids
       WHERE bid_date = CURDATE()
       AND status != 'cancelled'
       ORDER BY bid_amount DESC, created_at ASC`
    );

    if (bids.length === 0) {
      console.log("No bids today");
      return;
    }

    const winner = bids[0];

    //  STEP 1 — FINALIZE STATUSES
    for (const bid of bids) {

      const finalStatus = bid.id === winner.id ? "won" : "lost";

      await db.execute(
        `UPDATE bids SET status = ? WHERE id = ?`,
        [finalStatus, bid.id]
      );
    }

    //  STEP 2 — SAVE FEATURED ALUMNI (for tomorrow)
    await db.execute(
      `INSERT INTO featured_alumni
       (profile_id, bid_id, feature_date)
       VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 1 DAY))`,
      [winner.profile_id, winner.id]
    );

    //  STEP 3 — SEND EMAIL TO WINNER
    const [profile] = await db.execute(
      `SELECT u.email
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [winner.profile_id]
    );

    if (profile.length > 0) {
      await EmailService.sendWinnerNotification(profile[0].email);
    }

    console.log("Winner selected:", winner.profile_id);

  } catch (error) {

    console.error("Scheduler error:", error);

  }

});