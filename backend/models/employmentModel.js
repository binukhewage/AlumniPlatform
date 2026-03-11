import db from "../config/db.js";

class EmploymentModel {

  static async createJob(profileId, job){

    const { company, position, start_date, end_date } = job;

    const [result] = await db.execute(
      `INSERT INTO employment_history
      (profile_id, company, position, start_date, end_date)
      VALUES (?,?,?,?,?)`,
      [profileId, company, position, start_date, end_date]
    );

    return result.insertId;

  }

  static async getJobs(profileId){

    const [rows] = await db.execute(
      `SELECT * FROM employment_history
       WHERE profile_id=?
       ORDER BY id DESC`,
      [profileId]
    );

    return rows;

  }

  static async updateJob(id, job){

    const { company, position, start_date, end_date } = job;

    await db.execute(
      `UPDATE employment_history
       SET company=?, position=?, start_date=?, end_date=?
       WHERE id=?`,
      [company, position, start_date, end_date, id]
    );

  }

  static async deleteJob(id){

    await db.execute(
      `DELETE FROM employment_history WHERE id=?`,
      [id]
    );

  }

}

export default EmploymentModel;