// services/analyticsService.js

import db from "../config/db.js";

class AnalyticsService {
  // KPI Cards
  static async getSummary() {
    const [[users]] = await db.execute(
      "SELECT COUNT(*) AS total FROM profiles"
    );

    const [[certs]] = await db.execute(
      "SELECT COUNT(*) AS total FROM certifications"
    );

    const [[featured]] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM featured_alumni
      WHERE feature_date = CURDATE()
    `);

    const [[industry]] = await db.execute(`
      SELECT industry, COUNT(*) AS total
      FROM employment_history
      WHERE industry IS NOT NULL
      GROUP BY industry
      ORDER BY total DESC
      LIMIT 1
    `);

    return {
      totalAlumni: users.total,
      totalCertifications: certs.total,
      featuredToday: featured.total,
      topIndustry: industry?.industry || "N/A",
    };
  }

  // 1 Radar Chart
  // current = fetched from courses table
  // target = fixed desired demand
  static async getSkillsGap() {
    const skillMap = {
      Docker: ["docker"],
      Kubernetes: ["kubernetes", "k8s"],
      Cloud: ["aws", "azure", "gcp", "cloud"],
      Data: ["data", "analytics", "tableau", "power bi", "sql"],
      Agile: ["agile", "scrum", "pmp"],
      Cyber: ["cyber", "security", "ethical hacking"],
    };

    const [rows] = await db.execute(`
      SELECT course_name
      FROM courses
      WHERE course_name IS NOT NULL
    `);

    const counts = {
      Docker: 0,
      Kubernetes: 0,
      Cloud: 0,
      Data: 0,
      Agile: 0,
      Cyber: 0,
    };

    rows.forEach((row) => {
      const name = row.course_name.toLowerCase();

      Object.entries(skillMap).forEach(([skill, keywords]) => {
        if (keywords.some((word) => name.includes(word))) {
          counts[skill]++;
        }
      });
    });

    return [
      { subject: "Docker", current: counts.Docker, target: 9 },
      { subject: "Kubernetes", current: counts.Kubernetes, target: 8 },
      { subject: "Cloud", current: counts.Cloud, target: 9 },
      { subject: "Data", current: counts.Data, target: 8 },
      { subject: "Agile", current: counts.Agile, target: 7 },
      { subject: "Cyber", current: counts.Cyber, target: 8 },
    ];
  }

  // 2 Pie Chart
  static async getEmploymentSectors() {
    const [rows] = await db.execute(`
      SELECT industry AS name, COUNT(*) AS value
      FROM employment_history
      WHERE industry IS NOT NULL
      GROUP BY industry
      ORDER BY value DESC
    `);

    return rows;
  }

  // 3 Job Titles
  static async getJobTitles() {
    const [rows] = await db.execute(`
      SELECT position AS name, COUNT(*) AS value
      FROM employment_history
      GROUP BY position
      ORDER BY value DESC
      LIMIT 8
    `);

    return rows;
  }

  // 4 Top Employers
  static async getTopEmployers() {
    const [rows] = await db.execute(`
      SELECT company AS name, COUNT(*) AS value
      FROM employment_history
      GROUP BY company
      ORDER BY value DESC
      LIMIT 8
    `);

    return rows;
  }

  // 5 Geographic
  static async getGeographicDistribution() {
    const [rows] = await db.execute(`
      SELECT location AS name, COUNT(*) AS value
      FROM employment_history
      WHERE location IS NOT NULL
      GROUP BY location
      ORDER BY value DESC
    `);

    return rows;
  }

  // 6 Sector Demand
  static async getSectorDemand() {
    const [rows] = await db.execute(`
      SELECT industry AS name, COUNT(*) AS value
      FROM employment_history
      WHERE industry IS NOT NULL
      GROUP BY industry
      ORDER BY value DESC
    `);

    return rows;
  }

  // 7 Certification Growth
  static async getCertifications() {
    const [rows] = await db.execute(`
      SELECT DATE_FORMAT(completion_date, '%Y-%m') AS name,
      COUNT(*) AS value
      FROM certifications
      WHERE completion_date IS NOT NULL
      GROUP BY DATE_FORMAT(completion_date, '%Y-%m')
      ORDER BY name ASC
    `);

    return rows;
  }

  // 8 Courses Trend
  static async getCoursesPopularity() {
    const [rows] = await db.execute(`
      SELECT course_name AS name, COUNT(*) AS value
      FROM courses
      GROUP BY course_name
      ORDER BY value DESC
      LIMIT 8
    `);

    return rows;
  }
}

export default AnalyticsService;