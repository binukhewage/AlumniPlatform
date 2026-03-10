import db from "../config/db.js";

class DegreeModel {

  static async addDegree(profileId, data) {

    const sql = `
    INSERT INTO degrees
    (profile_id, degree_name, university, degree_url, completion_date)
    VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      profileId,
      data.degree_name,
      data.university,
      data.degree_url,
      data.completion_date
    ]);

    return result.insertId;
  }

  static async getDegrees(profileId) {

    const [rows] = await db.execute(
      "SELECT * FROM degrees WHERE profile_id = ?",
      [profileId]
    );

    return rows;
  }

  static async updateDegree(id, data) {

    const sql = `
    UPDATE degrees
    SET degree_name=?, university=?, degree_url=?, completion_date=?
    WHERE id=?
    `;

    await db.execute(sql, [
      data.degree_name,
      data.university,
      data.degree_url,
      data.completion_date,
      id
    ]);
  }

  static async deleteDegree(id) {

    await db.execute(
      "DELETE FROM degrees WHERE id=?",
      [id]
    );
  }
}

export default DegreeModel;