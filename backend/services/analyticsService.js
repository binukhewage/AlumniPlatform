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

  static async getTopEmployers() {
    const [rows] = await db.execute(`
      SELECT company AS name, COUNT(*) AS value
      FROM employment_history
      GROUP BY company
      ORDER BY value DESC
      LIMIT 5
    `);

    return rows;
  }

  static async getJobTitles() {
    const [rows] = await db.execute(`
      SELECT position AS name, COUNT(*) AS value
      FROM employment_history
      GROUP BY position
      ORDER BY value DESC
      LIMIT 5
    `);

    return rows;
  }

  static async getGrowthOverTime() {
    const [rows] = await db.execute(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS name,
      COUNT(*) AS value
      FROM users
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY name ASC
    `);

    return rows;
  }

  static async getDegreeDistribution() {
    const [rows] = await db.execute(`
      SELECT degree_name AS name, COUNT(*) AS value
      FROM degrees
      GROUP BY degree_name
      ORDER BY value DESC
      LIMIT 6
    `);

    return rows;
  }
  static async getSkillsGap() {
    return [
      { subject: "AI", current: 3, target: 8 },
      { subject: "Cloud", current: 2, target: 7 },
      { subject: "Cyber", current: 4, target: 7 },
      { subject: "Web", current: 8, target: 10 },
      { subject: "Data", current: 3, target: 9 },
      { subject: "Mobile", current: 5, target: 8 },
    ];
  }
  
  static async getGraduationYears() {
    const [rows] = await db.execute(`
      SELECT YEAR(completion_date) AS name,
      COUNT(*) AS value
      FROM degrees
      WHERE completion_date IS NOT NULL
      GROUP BY YEAR(completion_date)
      ORDER BY name ASC
    `);
  
    return rows;
  }
  
  static async getSectorDemand() {
    return [
      { name: "Technology", value: 12 },
      { name: "Finance", value: 8 },
      { name: "Healthcare", value: 6 },
      { name: "Education", value: 5 },
      { name: "Marketing", value: 4 }
    ];
  }
  
  static async getCoursesPopularity() {
    const [rows] = await db.execute(`
      SELECT course_name AS name,
      COUNT(*) AS value
      FROM courses
      GROUP BY course_name
      ORDER BY value DESC
      LIMIT 6
    `);
  
    return rows;
  }
}

export default AnalyticsService;