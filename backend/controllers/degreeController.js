import DegreeService from "../services/degreeService.js";

class DegreeController {

  static async addDegree(req, res) {

    try {

      const userId = req.user.userId;

      const result = await DegreeService.addDegree(userId, req.body);

      res.status(201).json(result);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }

  static async getDegrees(req, res) {

    try {

      const userId = req.user.userId;

      const degrees = await DegreeService.getDegrees(userId);

      res.json(degrees);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }

  static async updateDegree(req, res) {

    try {

      const result = await DegreeService.updateDegree(
        req.params.id,
        req.body
      );

      res.json(result);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }

  static async deleteDegree(req, res) {

    try {

      const result = await DegreeService.deleteDegree(
        req.params.id
      );

      res.json(result);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }

}

export default DegreeController;