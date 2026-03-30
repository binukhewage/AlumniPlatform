import db from "../config/db.js";

// Model to handle password reset token operations
// Used in "Forgot Password" feature
class PasswordResetTokenModel {

  // Create and store a password reset token with expiry
  static async createToken(userId, token, expiresAt) {
    await db.execute(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );
  }

  // Find a token in database (used during password reset)
  static async findByToken(token) {
    const [rows] = await db.execute(
      "SELECT * FROM password_reset_tokens WHERE token = ?",
      [token]
    );

    // Return the matching token record
    return rows[0];
  }

  // Delete token after use (one-time usage security)
  static async deleteById(id) {
    await db.execute(
      "DELETE FROM password_reset_tokens WHERE id = ?",
      [id]
    );
  }
}

export default PasswordResetTokenModel;