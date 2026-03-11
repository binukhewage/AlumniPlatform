import db from "../config/db.js";

class LicenceModel {

  static async createLicence(profileId, licence){

    const { licence_name, authority, licence_url, completion_date } = licence;

    const [result] = await db.execute(
      `INSERT INTO licences 
      (profile_id, licence_name, authority, licence_url, completion_date)
      VALUES (?,?,?,?,?)`,
      [profileId, licence_name, authority, licence_url, completion_date]
    );

    return result.insertId;

  }

  static async getLicences(profileId){

    const [rows] = await db.execute(
      `SELECT * FROM licences 
       WHERE profile_id = ?
       ORDER BY id DESC`,
      [profileId]
    );

    return rows;

  }

  static async updateLicence(id, licence){

    const { licence_name, authority, licence_url, completion_date } = licence;

    await db.execute(
      `UPDATE licences
       SET licence_name=?, authority=?, licence_url=?, completion_date=?
       WHERE id=?`,
      [licence_name, authority, licence_url, completion_date, id]
    );

  }

  static async deleteLicence(id){

    await db.execute(
      `DELETE FROM licences WHERE id=?`,
      [id]
    );

  }

}

export default LicenceModel;