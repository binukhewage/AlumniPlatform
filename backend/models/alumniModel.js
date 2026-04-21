import db from "../config/db.js";

class AlumniModel {
  static async getAll() {
    const [rows] = await db.execute(`
      SELECT
        p.id,
        p.full_name,
        p.bio,
        p.linkedin_url,
        p.profile_image,
        d.degree_name,
        d.completion_date,
        e.company,
        e.position,
        e.industry
      FROM profiles p

      LEFT JOIN degrees d
        ON d.profile_id = p.id

      LEFT JOIN employment_history e
        ON e.id = (
          SELECT eh.id
          FROM employment_history eh
          WHERE eh.profile_id = p.id
          ORDER BY
            (eh.end_date IS NULL) DESC,
            eh.end_date DESC,
            eh.start_date DESC,
            eh.id DESC
          LIMIT 1
        )

      ORDER BY p.id DESC
    `);

    return rows;
  }
}

export default AlumniModel;