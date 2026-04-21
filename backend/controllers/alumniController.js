import AlumniService from "../services/alumniService.js";

class AlumniController {
  static async getAll(req, res) {
    try {
      const result = await AlumniService.getAll();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

export default AlumniController;