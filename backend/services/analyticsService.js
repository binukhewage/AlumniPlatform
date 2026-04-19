import db from "../config/db.js";

class AnalyticsService {
  // Dashboard cards
  static async getSummary() {
    const [[users]] = await db.execute(
      "SELECT COUNT(*) AS total FROM profiles"
    );

    const [[certs]] = await db.execute(
      "SELECT COUNT(*) AS total FROM certifications"
    );

    const [[featured]] = await db.execute(
      `SELECT COUNT(*) AS total
       FROM featured_alumni
       WHERE feature_date = CURDATE()`
    );

    const [[industry]] = await db.execute(
      `SELECT company, COUNT(*) AS total
       FROM employment_history
       GROUP BY company
       ORDER BY total DESC
       LIMIT 1`
    );

    return {
      totalAlumni: users.total,
      totalCertifications: certs.total,
      featuredToday: featured.total,
      topIndustry: industry?.company || "N/A"
    };
  }

  // Employment chart
  static async getEmploymentSectors() {
    const [rows] = await db.execute(
      `SELECT company AS name, COUNT(*) AS value
       FROM employment_history
       GROUP BY company
       ORDER BY value DESC`
    );

    return rows;
  }

  // Certifications chart
  static async getCertifications() {
    const [rows] = await db.execute(
      `SELECT certification_name AS name, COUNT(*) AS value
       FROM certifications
       GROUP BY certification_name
       ORDER BY value DESC`
    );

    return rows;
  }
}

export default AnalyticsService;