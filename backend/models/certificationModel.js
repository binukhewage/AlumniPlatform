import db from "../config/db.js";

class CertificationModel {

  static async addCertification(profileId, data) {

    const sql = `
    INSERT INTO certifications
    (profile_id, certification_name, organisation, cert_url, completion_date)
    VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      profileId,
      data.certification_name,
      data.organisation,
      data.cert_url,
      data.completion_date
    ]);

    return result.insertId;
  }

  static async getCertifications(profileId) {

    const [rows] = await db.execute(
      "SELECT * FROM certifications WHERE profile_id=?",
      [profileId]
    );

    return rows;
  }

  static async deleteCertification(id) {

    await db.execute(
      "DELETE FROM certifications WHERE id=?",
      [id]
    );
  }
}

export default CertificationModel;