import db from "../config/db.js";

class ProfileModel {

  static async createProfile(userId, data) {

    const sql = `
    INSERT INTO profiles 
    (user_id, full_name, bio, linkedin_url, profile_image)
    VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      userId,
      data.full_name,
      data.bio,
      data.linkedin_url,
      data.profile_image
    ]);

    return result.insertId;
  }

  static async getProfileByUser(userId) {

    const [rows] = await db.execute(
      "SELECT * FROM profiles WHERE user_id = ?",
      [userId]
    );

    return rows[0];
  }

  static async updateProfile(userId, data) {

    const sql = `
    UPDATE profiles
    SET full_name=?, bio=?, linkedin_url=?, profile_image=?
    WHERE user_id=?
    `;

    await db.execute(sql, [
      data.full_name,
      data.bio,
      data.linkedin_url,
      data.profile_image,
      userId
    ]);
  }

  static async deleteProfile(userId) {

    await db.execute(
      "DELETE FROM profiles WHERE user_id=?",
      [userId]
    );
  }
}

export default ProfileModel;