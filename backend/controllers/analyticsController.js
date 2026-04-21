import AnalyticsService from "../services/analyticsService.js";

class AnalyticsController {
  static async getSummary(req, res) {
    try {
      const data = await AnalyticsService.getSummary();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSkillsGap(req, res) {
    try {
      const data = await AnalyticsService.getSkillsGap();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmploymentSectors(req, res) {
    try {
      const data = await AnalyticsService.getEmploymentSectors();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getJobTitles(req, res) {
    try {
      const data = await AnalyticsService.getJobTitles();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopEmployers(req, res) {
    try {
      const data = await AnalyticsService.getTopEmployers();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getGeographicDistribution(req, res) {
    try {
      const data = await AnalyticsService.getGeographicDistribution();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSectorDemand(req, res) {
    try {
      const data = await AnalyticsService.getSectorDemand();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCertifications(req, res) {
    try {
      const data = await AnalyticsService.getCertifications();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCoursesPopularity(req, res) {
    try {
      const data = await AnalyticsService.getCoursesPopularity();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AnalyticsController;