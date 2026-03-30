// Model to manage email verification tokens
// Used during user registration to verify email ownership

import db from "../config/db.js";

class VerificationTokenModel {

  // Store a verification token with expiry time
  static async createToken(userId, token, expiresAt) {
    await db.execute(
      "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );
  }

  // Find a token in the database (used when user clicks verification link)
  static async findByToken(token) {
    const [rows] = await db.execute(
      "SELECT * FROM email_verification_tokens WHERE token = ?",
      [token]
    );
    return rows[0];
  }

  // Delete token after successful verification (one-time use)
  static async deleteById(id) {
    await db.execute(
      "DELETE FROM email_verification_tokens WHERE id = ?",
      [id]
    );
  }
}

export default VerificationTokenModel;
