import db from "../config/db.js";

class PasswordResetTokenModel {

  static async createToken(userId, token, expiresAt) {
    await db.execute(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );
  }

  static async findByToken(token) {
    const [rows] = await db.execute(
      "SELECT * FROM password_reset_tokens WHERE token = ?",
      [token]
    );
    return rows[0];
  }

  static async deleteById(id) {
    await db.execute(
      "DELETE FROM password_reset_tokens WHERE id = ?",
      [id]
    );
  }
}

export default PasswordResetTokenModel;