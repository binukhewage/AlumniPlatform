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

  static async getEmploymentSectors(req, res) {
    try {
      const data = await AnalyticsService.getEmploymentSectors();
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
}

export default AnalyticsController;