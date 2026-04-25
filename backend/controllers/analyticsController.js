import AnalyticsService from "../services/analyticsService.js";

class AnalyticsController {
  static async getFilterOptions(req, res) {
    try {
      const data = await AnalyticsService.getFilterOptions();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSummary(req, res) {
    try {
      const data = await AnalyticsService.getSummary(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSkillsGap(req, res) {
    try {
      const data = await AnalyticsService.getSkillsGap(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmploymentSectors(req, res) {
    try {
      const data = await AnalyticsService.getEmploymentSectors(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getJobTitles(req, res) {
    try {
      const data = await AnalyticsService.getJobTitles(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopEmployers(req, res) {
    try {
      const data = await AnalyticsService.getTopEmployers(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getGeographicDistribution(req, res) {
    try {
      const data = await AnalyticsService.getGeographicDistribution(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSectorDemand(req, res) {
    try {
      const data = await AnalyticsService.getSectorDemand(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCertifications(req, res) {
    try {
      const data = await AnalyticsService.getCertifications(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCoursesPopularity(req, res) {
    try {
      const data = await AnalyticsService.getCoursesPopularity(req.query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AnalyticsController;