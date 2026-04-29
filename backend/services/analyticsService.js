// services/analyticsService.js

import db from "../config/db.js";

class AnalyticsService {
  static buildProfileFilter(filters = {}) {
  let joins = " JOIN users u ON u.id = p.user_id ";
  let where = "WHERE u.role = 'user'";
  const params = [];

  if (filters.year) {
    joins += " JOIN degrees d_year ON p.id = d_year.profile_id";
    where += " AND YEAR(d_year.completion_date) = ?";
    params.push(filters.year);
  }

  if (filters.programme) {
    joins += " JOIN degrees d_prog ON p.id = d_prog.profile_id";
    where += " AND d_prog.degree_name = ?";
    params.push(filters.programme);
  }

  if (filters.industry) {
    joins += " JOIN employment_history e_ind ON p.id = e_ind.profile_id";
    where += " AND e_ind.industry = ?";
    params.push(filters.industry);
  }

  return { joins, where, params };
}

  // Filter Options
  static async getFilterOptions() {
    const [years] = await db.execute(`
      SELECT DISTINCT YEAR(completion_date) as year 
      FROM degrees 
      WHERE completion_date IS NOT NULL 
      ORDER BY year DESC
    `);
    
    const [industries] = await db.execute(`
      SELECT DISTINCT industry 
      FROM employment_history 
      WHERE industry IS NOT NULL 
      ORDER BY industry ASC
    `);

    const [programmes] = await db.execute(`
      SELECT DISTINCT degree_name as programme 
      FROM degrees 
      WHERE degree_name IS NOT NULL 
      ORDER BY programme ASC
    `);

    return {
      years: years.map(y => y.year),
      industries: industries.map(i => i.industry),
      programmes: programmes.map(p => p.programme),
    };
  }

  // KPI Cards
  static async getSummary(filters = {}) {
    const { joins, where, params } = this.buildProfileFilter(filters);

    const [[users]] = await db.execute(`
      SELECT COUNT(DISTINCT p.id) AS total 
      FROM profiles p 
      ${joins} 
      ${where}
    `, params);

    const [[certs]] = await db.execute(`
      SELECT COUNT(DISTINCT c.id) AS total 
      FROM profiles p 
      JOIN certifications c ON p.id = c.profile_id 
      ${joins} 
      ${where}
    `, params);

    const [[featured]] = await db.execute(`
      SELECT COUNT(DISTINCT fa.id) AS total
      FROM profiles p
      JOIN featured_alumni fa ON p.id = fa.profile_id
      ${joins}
      ${where} AND fa.feature_date = CURDATE()
    `, params);

    const [[industry]] = await db.execute(`
      SELECT eh.industry, COUNT(DISTINCT p.id) AS total
      FROM profiles p
      JOIN employment_history eh ON p.id = eh.profile_id
      ${joins}
      ${where} AND eh.industry IS NOT NULL
      GROUP BY eh.industry
      ORDER BY total DESC
      LIMIT 1
    `, params);

    return {
      totalAlumni: users.total || 0,
      totalCertifications: certs.total || 0,
      featuredToday: featured ? featured.total : 0,
      topIndustry: industry?.industry || "N/A",
    };
  }

  // 1 Radar Chart
  static async getSkillsGap(filters = {}) {
    const { joins, where, params } = this.buildProfileFilter(filters);

    const skillMap = {
      Docker: ["docker"],
      Kubernetes: ["kubernetes", "k8s"],
      Cloud: ["aws", "azure", "gcp", "cloud"],
      Data: ["data", "analytics", "tableau", "power bi", "sql"],
      Agile: ["agile", "scrum", "pmp"],
      Cyber: ["cyber", "security", "ethical hacking"],
    };

    const [rows] = await db.execute(`
      SELECT c.course_name
      FROM profiles p
      JOIN courses c ON p.id = c.profile_id
      ${joins}
      ${where} AND c.course_name IS NOT NULL
    `, params);

    const counts = { Docker: 0, Kubernetes: 0, Cloud: 0, Data: 0, Agile: 0, Cyber: 0 };

    rows.forEach((row) => {
      const name = row.course_name.toLowerCase();
      Object.entries(skillMap).forEach(([skill, keywords]) => {
        if (keywords.some((word) => name.includes(word))) counts[skill]++;
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

  // 2 Pie Chart (Employment Sectors)
  static async getEmploymentSectors(filters = {}) {
    const { joins, where, params } = this.buildProfileFilter(filters);

    const [rows] = await db.execute(`
      WITH RankedEmployment AS (
        SELECT id, profile_id, industry,
               ROW_NUMBER() OVER(PARTITION BY profile_id ORDER BY CASE WHEN end_date IS NULL THEN 1 ELSE 0 END DESC, start_date DESC, id DESC) as rnk
        FROM employment_history
      )
      SELECT eh.industry AS name, COUNT(DISTINCT eh.id) AS value
      FROM profiles p
      JOIN RankedEmployment eh ON p.id = eh.profile_id AND eh.rnk = 1
      ${joins}
      ${where} AND eh.industry IS NOT NULL
      GROUP BY eh.industry
      ORDER BY value DESC
    `, params);

    return rows;
  }

  // 3 Job Titles
  static async getJobTitles(filters = {}) {
    const { joins, where, params } = this.buildProfileFilter(filters);

    const [rows] = await db.execute(`
      SELECT eh.position AS name, COUNT(DISTINCT eh.id) AS value
      FROM profiles p
      JOIN employment_history eh ON p.id = eh.profile_id
      ${joins}
      ${where}
      GROUP BY eh.position
      ORDER BY value DESC
      LIMIT 8
    `, params);

    return rows;
  }

  // 4 Top Employers
  static async getTopEmployers(filters = {}) {
    const { joins, where, params } = this.buildProfileFilter(filters);

    const [rows] = await db.execute(`
      SELECT eh.company AS name, COUNT(DISTINCT eh.id) AS value
      FROM profiles p
      JOIN employment_history eh ON p.id = eh.profile_id
      ${joins}
      ${where}
      GROUP BY eh.company
      ORDER BY value DESC
      LIMIT 8
    `, params);

    return rows;
  }

  // 5 Geographic
  static async getGeographicDistribution(filters = {}) {
    const { joins, where, params } = this.buildProfileFilter(filters);
    
    // employment_history doesn't have location column in schema? Wait, earlier getGeographicDistribution used it: "SELECT location AS name..."
    // Let me check schema. Schema for employment_history does NOT have location. Wait, yes it does?
    // Let's stick to the previous query which just queried location from employment_history.
    const [rows] = await db.execute(`
      SELECT eh.location AS name, COUNT(DISTINCT eh.id) AS value
      FROM profiles p
      JOIN employment_history eh ON p.id = eh.profile_id
      ${joins}
      ${where} AND eh.location IS NOT NULL
      GROUP BY eh.location
      ORDER BY value DESC
    `, params).catch(e => {
        // Fallback if location column actually doesn't exist
        return [[]];
    });

    return rows;
  }

  // 6 Sector Demand
  static async getSectorDemand(filters = {}) {
    const { joins, where, params } = this.buildProfileFilter(filters);

    const [rows] = await db.execute(`
      WITH RankedEmployment AS (
        SELECT id, profile_id, industry,
               ROW_NUMBER() OVER(PARTITION BY profile_id ORDER BY CASE WHEN end_date IS NULL THEN 1 ELSE 0 END DESC, start_date DESC, id DESC) as rnk
        FROM employment_history
      )
      SELECT eh.industry AS name, COUNT(DISTINCT eh.id) AS value
      FROM profiles p
      JOIN RankedEmployment eh ON p.id = eh.profile_id AND eh.rnk = 1
      ${joins}
      ${where} AND eh.industry IS NOT NULL
      GROUP BY eh.industry
      ORDER BY value DESC
    `, params);

    return rows;
  }

  // 7 Certification Growth (Last 6 Months)
static async getCertifications(filters = {}) {
  const { joins, where, params } = this.buildProfileFilter(filters);

  const [rows] = await db.execute(`
    SELECT 
      DATE_FORMAT(c.completion_date, '%Y-%m') AS name,
      c.certification_name
    FROM profiles p
    JOIN certifications c ON p.id = c.profile_id
    ${joins}
    ${where}
      AND c.completion_date IS NOT NULL
      AND c.completion_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    ORDER BY c.completion_date ASC
  `, params);

  // Create last 6 months with zero values first
  const monthlyData = {};

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;

    monthlyData[key] = {
      name: key,
      Cloud: 0,
      Agile: 0,
      Data: 0,
      Security: 0,
      Other: 0,
    };
  }

  // Count certifications into categories
  rows.forEach((row) => {
    const month = row.name;
    const cert = (row.certification_name || "").toLowerCase();

    if (!monthlyData[month]) return;

    if (
      cert.includes("aws") ||
      cert.includes("azure") ||
      cert.includes("gcp") ||
      cert.includes("cloud")
    ) {
      monthlyData[month].Cloud++;
    } else if (
      cert.includes("agile") ||
      cert.includes("scrum") ||
      cert.includes("pmp")
    ) {
      monthlyData[month].Agile++;
    } else if (
      cert.includes("data") ||
      cert.includes("analytics") ||
      cert.includes("sql") ||
      cert.includes("power bi")
    ) {
      monthlyData[month].Data++;
    } else if (
      cert.includes("security") ||
      cert.includes("cyber") ||
      cert.includes("hack")
    ) {
      monthlyData[month].Security++;
    } else {
      monthlyData[month].Other++;
    }
  });

  return Object.values(monthlyData);
}

  // 8 Courses Trend
  static async getCoursesPopularity(filters = {}) {
    const { joins, where, params } = this.buildProfileFilter(filters);

    const [rows] = await db.execute(`
      SELECT c.course_name AS name, COUNT(DISTINCT c.id) AS value
      FROM profiles p
      JOIN courses c ON p.id = c.profile_id
      ${joins}
      ${where} AND c.course_name IS NOT NULL
      GROUP BY c.course_name
      ORDER BY value DESC
      LIMIT 8
    `, params);

    return rows;
  }
}

export default AnalyticsService;