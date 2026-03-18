import CertificationService from "../services/certificationService.js";

class CertificationController {

  static async addCertification(req, res) {
    try {

      const userId = req.user.userId;

      const result = await CertificationService.addCertification(
        userId,
        req.body
      );

      res.status(201).json(result);

    } catch (error) {

      res.status(400).json({ error: error.message });

    }
  }

  static async getCertifications(req, res) {
    try {

      const userId = req.user.userId;

      const certs = await CertificationService.getCertifications(userId);

      res.json(certs);

    } catch (error) {

      res.status(400).json({ error: error.message });

    }
  }

  static async updateCertification(req, res) {
    try {

      const result = await CertificationService.updateCertification(
        req.params.id,
        req.body
      );

      res.json(result);

    } catch (error) {

      res.status(400).json({ error: error.message });

    }
  }

  static async deleteCertification(req, res) {
    try {

      const result = await CertificationService.deleteCertification(
        req.params.id
      );

      res.json(result);

    } catch (error) {

      res.status(400).json({ error: error.message });

    }
  }

}

export default CertificationController;