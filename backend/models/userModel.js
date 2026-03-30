// UserModel handles database operations related to authentication users
// Stores login credentials (email + password)

import db from "../config/db.js";

class UserModel {
  static async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  // Create a new user with hashed password
  static async createUser(email, hashedPassword) {
    const [result] = await db.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );
    return result.insertId;
  }
}

export default UserModel;
